describe("Dashboard", function() {
  it("should create a dashboard with no monitors", function() {
    var dashboard = new jashboard.model.Dashboard(
      {id: "test_id", name: "test_name", other: "other"}
    );

    expect(dashboard.id).toEqual("test_id");
    expect(dashboard.name).toEqual("test_name");
    expect(dashboard.monitors).toEqual([]);
  });

  it("should add monitor objects", function() {
    var dashboard = new jashboard.model.Dashboard({});
    dashboard.monitors.push({name: "test.monitor.1"});
    dashboard.monitors.push({name: "test.monitor.2"});

    expect(dashboard.monitors.length).toEqual(2);
    expect(dashboard.monitors).toContain({name: "test.monitor.1"});
    expect(dashboard.monitors).toContain({name: "test.monitor.2"});
  });
});

