describe("ModelMapper", function() {
  var pluginManager, monitorAdapter, modelMapper;

  beforeEach(function() {
    pluginManager = {
      findMonitorAdapter: jasmine.createSpy("pluginManager.findMonitorAdapter()").andCallFake(function(type) {
        return {
          convertDataToMonitorConfiguration: function(configData) {
            return {model: configData};
          },
          convertDataToRuntimeInfo: function(runtimeData) {
            return {model: runtimeData};
          },
          convertMonitorConfigurationToData: function(configuration) {
            return {data: configuration}
          }
        };
      })
    };

    modelMapper = new jashboard.ModelMapper(pluginManager);
  });

  it("should map the data to a new Monitor", function() {
    spyOn(jashboard.model, "Monitor").andCallThrough();
    var data = {id: "test_id", type: "test_type", configuration: "test_configuration"};

    var monitor = modelMapper.mapDataToMonitor(data);

    expect(jashboard.model.Monitor).toHaveBeenCalledWith(data);
    expect(pluginManager.findMonitorAdapter).toHaveBeenCalledWith("test_type");
    expect(monitor.configuration).toEqual({model: "test_configuration"});
  });

  it("should map the data to a monitor runtime info", function() {
    spyOn(jashboard.model, "Monitor").andCallThrough();

    var monitorRuntimeInfo = modelMapper.mapDataToMonitorRuntimeInfo("test_type", "test_runtime_data");

    expect(pluginManager.findMonitorAdapter).toHaveBeenCalledWith("test_type");
    expect(monitorRuntimeInfo).toEqual({model: "test_runtime_data"});
  });

  it("should map the monitor model to data", function() {
    var monitor = {
      name: "test_name",
      refreshInterval: "test_interval",
      type: "test_type",
      configuration: "test_configuration",
      size: "test_size",
      position: "test_position"
    };

    var data = modelMapper.mapMonitorToData(monitor);

    expect(pluginManager.findMonitorAdapter).toHaveBeenCalledWith("test_type");
    expect(data).toEqual({
      name: "test_name",
      refresh_interval: "test_interval",
      type: "test_type",
      configuration: {data: "test_configuration"},
      size: "test_size",
      position: "test_position"
    });
  });

  it("should map the monitor configuration model to data", function() {
    var configuration = "test_configuration";

    var configData = modelMapper.mapMonitorConfigurationToData("test_type", configuration);

    expect(pluginManager.findMonitorAdapter).toHaveBeenCalledWith("test_type");
    expect(configData).toEqual({data: "test_configuration"});
  });

  it("should map the data to a new Dashboard", function() {
    spyOn(jashboard.model, "Dashboard").andCallThrough();
    spyOn(modelMapper, "mapDataToMonitor").andCallFake(function(monitorData) {
      return {id: monitorData};
    });
    var data = {
      id: "test.dashboard.1",
      monitors: ["monitor_1", "monitor_2"]
    };

    var dashboard = modelMapper.mapDataToDashboard(data);

    expect(jashboard.model.Dashboard).toHaveBeenCalledWith(data);
    expect(dashboard.monitors.length).toEqual(2);
    expect(dashboard.monitors).toContain({id: "monitor_1"});
    expect(dashboard.monitors).toContain({id: "monitor_2"});
  });
});