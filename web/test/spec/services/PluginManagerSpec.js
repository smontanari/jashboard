describe("PluginManager", function() {
  var monitorPlugin, mockAdapter;
  var TestAdapter = function() {return mockAdapter;};
  var adapterMethods = [
    'convertDataToRuntimeInfo',
    'parseMonitorConfigurationForm',
    'defaultSize',
    'init'
  ];

  beforeEach(function() {
    pluginManager = new jashboard.PluginManager();
  });

  it("should register and return a monitor plugin", function() {
    mockAdapter = jasmine.createSpyObj("TestAdapter", adapterMethods);

    pluginManager.addMonitorAdapter("test", TestAdapter);
    plugin = pluginManager.findMonitorAdapter("test");

    expect(plugin).toEqual(mockAdapter);
  });
  it("should initialise the plugin if the init method is provided", function() {
    mockAdapter = jasmine.createSpyObj("TestAdapter", adapterMethods);

    pluginManager.addMonitorAdapter("test", TestAdapter);

    expect(mockAdapter.init).toHaveBeenCalled();
  });
  it("should return a list of the monitor types", function() {
    mockAdapter = jasmine.createSpyObj("TestAdapter", adapterMethods);
    pluginManager.addMonitorAdapter("test_type1", TestAdapter);
    pluginManager.addMonitorAdapter("test_type2", TestAdapter);

    expect(pluginManager.getAllMonitorTypes()).toEqual(['test_type1', 'test_type2']);
  });
  it("should throw an error if the plugin is not defined", function() {
    var f = function() {
      pluginManager.findMonitorAdapter("test", TestAdapter);
    };

    expect(f).toThrow("Adapter for monitor type [test] not found");
  });
  it("should throw an error if the plugin already exists", function() {
    mockAdapter = jasmine.createSpyObj("TestAdapter", adapterMethods);
    pluginManager.addMonitorAdapter("test", TestAdapter);
    var f = function() {
      pluginManager.addMonitorAdapter("test", TestAdapter);
    };

    expect(f).toThrow("Adapter for [test] already exists");
  });
  it("should throw an error if the plugin does not implement a convertDataToRuntimeInfo method", function() {
    mockAdapter = jasmine.createSpyObj("TestAdapter", ['defaultSize', 'parseMonitorConfigurationForm']);
    var f = function() {
      pluginManager.addMonitorAdapter("test", TestAdapter);
    };

    expect(f).toThrow("Adapter for [test] does not implement a convertDataToRuntimeInfo method");
  });
  it("should throw an error if the plugin does not implement a defaultSize method", function() {
    mockAdapter = jasmine.createSpyObj("TestAdapter", ['convertDataToRuntimeInfo', 'parseMonitorConfigurationForm']);
    var f = function() {
      pluginManager.addMonitorAdapter("test", TestAdapter);
    };

    expect(f).toThrow("Adapter for [test] does not implement a defaultSize method");
  });
  it("should throw an error if the plugin does not implement a parseMonitorConfigurationForm method", function() {
    mockAdapter = jasmine.createSpyObj("TestAdapter", ['convertDataToRuntimeInfo', 'defaultSize']);
    var f = function() {
      pluginManager.addMonitorAdapter("test", TestAdapter);
    };

    expect(f).toThrow("Adapter for [test] does not implement a parseMonitorConfigurationForm method");
  });
});
