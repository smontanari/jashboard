describe("MonitorLayoutManager", function() {
  it("should return [0, 0] when no other monitors are present", function() {
    var dashboard = { monitors: [] };

    var position = new jashboard.MonitorLayoutManager().nextAvailableMonitorPosition(dashboard);

    expect(position).toEqual({top: 0, left: 0});
  });
  it("should return a position below the lowest positioned monitor with an added margin of 20px", function() {
    var dashboard = { monitors: [
      {
        position: {top: 20, left: 50},
        size: {width: 200, height: 350}
      },
      {
        position: {top: 10, left: 600},
        size: {width: 200, height: 550}
      },
      {
        position: {top: 320, left: 50},
        size: {width: 200, height: 200}
      },
    ]};

    var position = new jashboard.MonitorLayoutManager().nextAvailableMonitorPosition(dashboard, 20);

    expect(position).toEqual({top: 580, left: 0});
  });
});