describe("ModelMapper", function() {
  var pluginManager, monitorAdapter, modelMapper;

  beforeEach(function() {
    pluginManager = {
      findMonitorAdapter: jasmine.createSpy("pluginManager.findMonitorAdapter()").andCallFake(function(type) {
        return {
          parseConfiguration: function(configData) {
            return {data: configData};
          },
          parseRuntimeInfo: function(runtimeData) {
            return {data: runtimeData};
          }
        };
      })
    };

    modelMapper = new jashboard.ModelMapper(pluginManager);
  });

  it("should map the data to a new Monitor", function() {
    spyOn(jashboard.model, "Monitor").andCallThrough();
    var data = {id: "test_id", type: "test_type", configuration: "test_configuration"};

    var monitor = modelMapper.mapMonitor(data);

    expect(jashboard.model.Monitor).toHaveBeenCalledWith(data);
    expect(pluginManager.findMonitorAdapter).toHaveBeenCalledWith("test_type");
    expect(monitor.configuration).toEqual({data: "test_configuration"});
  });

  it("should map the data to a monitor runtime info", function() {
    spyOn(jashboard.model, "Monitor").andCallThrough();

    var monitorRuntimeInfo = modelMapper.mapMonitorRuntimeInfo("test_type", "test_runtime_data");

    expect(pluginManager.findMonitorAdapter).toHaveBeenCalledWith("test_type");
    expect(monitorRuntimeInfo).toEqual({data: "test_runtime_data"});
  });

  it("should map the data to a new Dashboard", function() {
    spyOn(jashboard.model, "Dashboard").andCallThrough();
    spyOn(modelMapper, "mapMonitor").andCallFake(function(monitorData) {
      return {id: monitorData};
    });
    var data = {
      id: "test.dashboard.1",
      monitors: ["monitor_1", "monitor_2"]
    };

    var dashboard = modelMapper.mapDashboard(data);

    expect(jashboard.model.Dashboard).toHaveBeenCalledWith(data);
    expect(dashboard.monitors.length).toEqual(2);
    expect(dashboard.monitors).toContain({id: "monitor_1"});
    expect(dashboard.monitors).toContain({id: "monitor_2"});
  });
});