describe("MonitorPositioning", function() {
  var monitorPositioning;
  describe("Available positions around one rectangle", function() {
    beforeEach(function() {
      $stub = testHelper.stubJQuery(".container");
      $stub.width = jasmine.createSpy().andReturn(100);
      monitorPositioning = new jashboard.MonitorPositioning();
    });

    it("should return a position at the right and one at the bottom of an existing monitor", function() {
      var monitor = {position: {top: 10, left: 10}, size: {width: 20, height: 30}};

      var positions = monitorPositioning.neighbourPositions(monitor, {width: 20, height: 50});

      expect(positions.length).toEqual(2);
      expect(positions[0]).toEqual({top: 10, left: 30});
      expect(positions[1]).toEqual({top: 40, left: 10});
    });

    it("should return a position at the left of an existing monitor", function() {
      var monitor = {position: {top: 10, left: 60}, size: {width: 30, height: 40}};

      var positions = monitorPositioning.neighbourPositions(monitor, {width: 50, height: 20});

      expect(positions.length).toEqual(1);
      expect(positions[0]).toEqual({top: 10, left: 10});
    });

    it("should return a position at the left and one at the bottom of an existing monitor", function() {
      var monitor = {position: {top: 10, left: 50}, size: {width: 40, height: 20}};

      var positions = monitorPositioning.neighbourPositions(monitor, {width: 20, height: 30});

      expect(positions.length).toEqual(2);
      expect(positions[0]).toEqual({top: 10, left: 30});
      expect(positions[1]).toEqual({top: 30, left: 50});
    });

    it("should return a position at the left, one at the right and one at the bottom of an existing monitor", function() {
      var monitor = {position: {top: 10, left: 40}, size: {width: 20, height: 50}};

      var positions = monitorPositioning.neighbourPositions(monitor, {width: 30, height: 40});

      expect(positions.length).toEqual(3);
      expect(positions[0]).toEqual({top: 10, left: 10});
      expect(positions[1]).toEqual({top: 10, left: 60});
      expect(positions[2]).toEqual({top: 60, left: 40});
    });

    it("should return a position at the top, one at the left and one at the bottom of an existing monitor", function() {
      var monitor = {position: {top: 50, left: 60}, size: {width: 20, height: 30}};

      var positions = monitorPositioning.neighbourPositions(monitor, {width: 30, height: 40});

      expect(positions.length).toEqual(3);
      expect(positions[0]).toEqual({top: 10, left: 60});
      expect(positions[1]).toEqual({top: 50, left: 30});
      expect(positions[2]).toEqual({top: 80, left: 60});
    });

    it("should return a position at the top, one at the right and one at the bottom of an existing monitor", function() {
      var monitor = {position: {top: 50, left: 20}, size: {width: 20, height: 30}};

      var positions = monitorPositioning.neighbourPositions(monitor, {width: 30, height: 40});

      expect(positions.length).toEqual(3);
      expect(positions[0]).toEqual({top: 10, left: 20});
      expect(positions[1]).toEqual({top: 50, left: 40});
      expect(positions[2]).toEqual({top: 80, left: 20});
    });

    it("should return a position at each side of an existing monitor", function() {
      var monitor = {position: {top: 50, left: 50}, size: {width: 20, height: 30}};

      var positions = monitorPositioning.neighbourPositions(monitor, {width: 30, height: 40});

      expect(positions.length).toEqual(4);
      expect(positions[0]).toEqual({top: 10, left: 50});
      expect(positions[1]).toEqual({top: 50, left: 20});
      expect(positions[2]).toEqual({top: 50, left: 70});
      expect(positions[3]).toEqual({top: 80, left: 50});
    });

    it("should return a position at the bottom of an existing monitor", function() {
      var monitor = {position: {top: 10, left: 20}, size: {width: 60, height: 40}};

      var positions = monitorPositioning.neighbourPositions(monitor, {width: 40, height: 20});

      expect(positions.length).toEqual(1);
      expect(positions[0]).toEqual({top: 50, left: 20});
    });

    it("should return no available neighbour positions", function() {
      var monitor = {position: {top: 10, left: 20}, size: {width: 80, height: 40}};

      var positions = monitorPositioning.neighbourPositions(monitor, {width: 90, height: 20});

      expect(positions.length).toEqual(0);
    });
  });
});