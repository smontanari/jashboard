describe("Monitor", function() {
  it("should create a monitor with empty settings and runtime info", function() {
    var monitor = new jashboard.model.Monitor(
      {id: "test_id", name: "test_name", type: "test_type", refresh_interval: 123}
    );

    expect(monitor.id).toEqual("test_id");
    expect(monitor.name).toEqual("test_name");
    expect(monitor.refreshInterval).toEqual(123);
    expect(monitor.type).toEqual("test_type");
    expect(monitor.settings).toEqual({});
    expect(monitor.runtimeInfo).toEqual({});
  });
});
