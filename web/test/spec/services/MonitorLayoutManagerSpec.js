describe("MonitorLayoutManager", function() {
  var $stub, layoutManager, expectedMargin = 20, newMonitorSize,
      detectorConstructor, intersectionDetector, strategyConstructor, positioningStrategy;
  var dashboard, m1, m2, m3, defaultLocation, 
        m1Location, m2Location, m3Location,
        position1, position2, position3,
        location1, location2, location3;

  beforeEach(function() {
    newMonitorSize = {width: 200, height: 100};
    strategyConstructor = sinon.stub(jashboard, "MonitorPositioningStrategy");
    detectorConstructor = sinon.stub(jashboard, "IntersectionDetector");
    positioningStrategy = {
      neighbourPositions: sinon.stub()
    };
    positioningStrategy.neighbourPositions.returns("neighbourPositions");
    strategyConstructor.returns(positioningStrategy);
    intersectionDetector = {
      intersect: sinon.stub()
    };
    detectorConstructor.returns(intersectionDetector);

    defaultLocation = {position: {top: 0, left: 0}, size: newMonitorSize};
    m1 = {id:"m1", position: {top: 200, left: 20}, size: {width: 30, height: 40}};
    m2 = {id:"m2", position: {top: 230, left: 40}, size: {width: 10, height: 30}};
    m3 = {id:"m3", position: {top: 350, left: 80}, size: {width: 70, height: 80}};
    dashboard = { monitors: [m2, m1, m3]};
    position1 = {top: 1, left: 1};
    position2 = {top: 2, left: 2};
    position3 = {top: 3, left: 3};
    m1Location = {position: m1.position, size: {width: m1.size.width + expectedMargin, height: m1.size.height + expectedMargin}};
    m2Location = {position: m2.position, size: {width: m2.size.width + expectedMargin, height: m2.size.height + expectedMargin}};
    m3Location = {position: m3.position, size: {width: m3.size.width + expectedMargin, height: m3.size.height + expectedMargin}};
    location1 = {position: position1, size: newMonitorSize};
    location2 = {position: position2, size: newMonitorSize};
    location3 = {position: position3, size: newMonitorSize};

    layoutManager = new jashboard.MonitorLayoutManager(intersectionDetector, positioningStrategy);
  });
  afterEach(function() {
    strategyConstructor.restore();
    detectorConstructor.restore();
  });

  it("should return position [0, 0] when no other monitors are present", function() {
    var dashboard = { monitors: [] };

    var position = layoutManager.nextAvailableMonitorPosition(dashboard, newMonitorSize);

    expect(position).toEqual({top: 0, left: 0});
    expect(intersectionDetector.intersect.called).toBeFalsy();
  });

  describe("Detecting monitor overlap", function() {
    it("should return position [0, 0] when no overlap with other monitors", function() {
      intersectionDetector.intersect.returns(false);

      var position = layoutManager.nextAvailableMonitorPosition(dashboard, newMonitorSize);

      expect(position).toEqual({top: 0, left: 0});
    });

    it("should take the margin into account when detecting overlap", function() {
      intersectionDetector.intersect.returns(false);

      var position = layoutManager.nextAvailableMonitorPosition(dashboard, newMonitorSize);

      expect(intersectionDetector.intersect).sinonStubToHaveBeenCalledWith({position: {top: 0, left: 0}, size: newMonitorSize}, m1Location);
      expect(intersectionDetector.intersect).sinonStubToHaveBeenCalledWith({position: {top: 0, left: 0}, size: newMonitorSize}, m2Location);
      expect(intersectionDetector.intersect).sinonStubToHaveBeenCalledWith({position: {top: 0, left: 0}, size: newMonitorSize}, m3Location);
    });
  });

  describe("Positioning next to other monitors", function() {
    beforeEach(function() {
      intersectionDetector.intersect.withArgs(defaultLocation).returns(true);
    });

    it("should order the monitors by proximity to the default position of [0,0]", function() {
      positioningStrategy.neighbourPositions.returns([]);

      layoutManager.nextAvailableMonitorPosition(dashboard, newMonitorSize);

      expect(positioningStrategy.neighbourPositions).sinonStubToHaveBeenCalledInOrderWith(0, m1Location, newMonitorSize);
      expect(positioningStrategy.neighbourPositions).sinonStubToHaveBeenCalledInOrderWith(1, m2Location, newMonitorSize);
      expect(positioningStrategy.neighbourPositions).sinonStubToHaveBeenCalledInOrderWith(2, m3Location, newMonitorSize);
    });

    it("should use the first available neighbour position of a monitor when not overlapping with other monitors", function() {
      positioningStrategy.neighbourPositions.withArgs(m1Location, newMonitorSize).returns([position1, position2, position3]);
      intersectionDetector.intersect.withArgs(location1).returns(true);
      intersectionDetector.intersect.withArgs(location2).returns(false);

      var position = layoutManager.nextAvailableMonitorPosition(dashboard, newMonitorSize);

      expect(position).toEqual(position2);
      expect(intersectionDetector.intersect).not.sinonStubToHaveBeenCalledWith(location3, m1Location);
      expect(positioningStrategy.neighbourPositions).not.sinonStubToHaveBeenCalledWith(m2Location);
      expect(positioningStrategy.neighbourPositions).not.sinonStubToHaveBeenCalledWith(m3Location);
    });

    it("should skip the current monitor when detecting intersection with other monitors", function() {
      positioningStrategy.neighbourPositions.withArgs(m1Location, newMonitorSize).returns([]);
      positioningStrategy.neighbourPositions.withArgs(m2Location, newMonitorSize).returns([position1, position2, position3]);
      intersectionDetector.intersect.withArgs(location1).returns(true);
      intersectionDetector.intersect.withArgs(location2).returns(true);
      intersectionDetector.intersect.withArgs(location3, m1).returns(true);
      intersectionDetector.intersect.withArgs(location3, m3).returns(false);

      var position = layoutManager.nextAvailableMonitorPosition(dashboard, newMonitorSize);

      expect(position).toEqual(position3);
      expect(intersectionDetector.intersect).not.sinonStubToHaveBeenCalledWith(location3, m2Location);
    });

    it("should move on to the next monitor to find available neighbour positions", function() {
      positioningStrategy.neighbourPositions.withArgs(m1Location, newMonitorSize).returns([position1]);
      positioningStrategy.neighbourPositions.withArgs(m2Location, newMonitorSize).returns([position2, position3]);
      intersectionDetector.intersect.withArgs(location1).returns(true);
      intersectionDetector.intersect.withArgs(location2).returns(true);
      intersectionDetector.intersect.withArgs(location3).returns(false);

      var position = layoutManager.nextAvailableMonitorPosition(dashboard, newMonitorSize);

      expect(position).toEqual(position3);
      expect(positioningStrategy.neighbourPositions).not.sinonStubToHaveBeenCalledWith(m3Location);
    });

    it("should return a position below all the monitors when no other available positions are found", function() {
      positioningStrategy.neighbourPositions.returns([]);

      var position = layoutManager.nextAvailableMonitorPosition(dashboard, newMonitorSize);

      expect(position).toEqual({top: 450, left: 0});
    });
  });
});
