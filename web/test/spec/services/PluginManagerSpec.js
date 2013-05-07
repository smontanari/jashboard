describe("PluginManager", function() {
  var testValidAdapter1, testValidAdapter2, pluginManager, logger;
  var adapterMethods = [
    'convertDataToRuntimeInfo',
    'parseMonitorConfigurationForm',
    'convertMonitorConfigurationToFormModel',
    'defaultSize'
  ];

  beforeEach(function() {
    logger = jasmine.createSpyObj("$log", ['info', 'warn'])
    testValidAdapter1 = jasmine.createSpyObj("TestValidAdapter", adapterMethods);
    testValidAdapter2 = jasmine.createSpyObj("TestValidAdapter", adapterMethods);
    jashboard.plugins = ['validType1', 'validType2', 'invalidType'];
    jashboard.plugin = _.extend(jashboard.plugin, {
      validType1: {
        MonitorAdapter: function() {return testValidAdapter1;}
      },
      validType2: {
        MonitorAdapter: function() {return testValidAdapter2;}
      }
    });
  });

  it("should return a list of registered valid monitor adapters excluding undefined types", function() {
    pluginManager = new jashboard.PluginManager(logger);

    expect(pluginManager.monitorAdapters).toEqual({
      validType1: testValidAdapter1,
      validType2: testValidAdapter2
    });
  });
  it("should return a list of registered valid monitor types excluding undefined type adapters", function() {
    jashboard.plugin.invalidType = {};
    pluginManager = new jashboard.PluginManager(logger);

    expect(pluginManager.monitorAdapters).toEqual({
      validType1: testValidAdapter1,
      validType2: testValidAdapter2
    });
  });
  it("should return a list of registered valid monitor types excluding type adapters not implementing 'convertDataToRuntimeInfo'", function() {
    var testInvalidAdapter = jasmine.createSpyObj("TestInvalidAdapter", ['parseMonitorConfigurationForm', 'convertMonitorConfigurationToFormModel', 'defaultSize']);
    jashboard.plugin.invalidType = {
      MonitorAdapter: function() {return testInvalidAdapter;}
    };

    pluginManager = new jashboard.PluginManager(logger);

    expect(pluginManager.monitorAdapters).toEqual({
      validType1: testValidAdapter1,
      validType2: testValidAdapter2
    });
  });
  it("should return a list of registered valid monitor types excluding type adapters not implementing 'parseMonitorConfigurationForm'", function() {
    var testInvalidAdapter = jasmine.createSpyObj("TestInvalidAdapter", ['convertDataToRuntimeInfo', 'convertMonitorConfigurationToFormModel', 'defaultSize']);
    jashboard.plugin.invalidType = {
      MonitorAdapter: function() {return testInvalidAdapter;}
    };

    pluginManager = new jashboard.PluginManager(logger);

    expect(pluginManager.monitorAdapters).toEqual({
      validType1: testValidAdapter1,
      validType2: testValidAdapter2
    });
  });
  it("should return a list of registered valid monitor types excluding type adapters not implementing 'convertMonitorConfigurationToFormModel'", function() {
    var testInvalidAdapter = jasmine.createSpyObj("TestInvalidAdapter", ['convertDataToRuntimeInfo', 'parseMonitorConfigurationForm', 'defaultSize']);
    jashboard.plugin.invalidType = {
      MonitorAdapter: function() {return testInvalidAdapter;}
    };

    pluginManager = new jashboard.PluginManager(logger);

    expect(pluginManager.monitorAdapters).toEqual({
      validType1: testValidAdapter1,
      validType2: testValidAdapter2
    });
  });
  it("should return a list of registered valid monitor types excluding type adapters not implementing 'defaultSize'", function() {
    var testInvalidAdapter = jasmine.createSpyObj("TestInvalidAdapter", ['convertDataToRuntimeInfo', 'parseMonitorConfigurationForm', 'convertMonitorConfigurationToFormModel']);
    jashboard.plugin.invalidType = {
      MonitorAdapter: function() {return testInvalidAdapter;}
    };

    pluginManager = new jashboard.PluginManager(logger);

    expect(pluginManager.monitorAdapters).toEqual({
      validType1: testValidAdapter1,
      validType2: testValidAdapter2
    });
  });
  it("should return a list of registered valid monitor types excluding type adapters already defined", function() {
    var counter = 0;
    var testValidAdapter3a = jasmine.createSpyObj("TestValidAdapterA", adapterMethods);
    var testValidAdapter3b = jasmine.createSpyObj("TestValidAdapterB", adapterMethods);
    jashboard.plugins = ['validType1', 'validType2', 'validType3', 'validType3'];
    jashboard.plugin = _.extend(jashboard.plugin, {
      validType3: {
        MonitorAdapter: function() {
          counter++;
          if (counter === 1) {
            return testValidAdapter3a;
          }
          return testValidAdapter3b;
        }
      },
    });
    
    pluginManager = new jashboard.PluginManager(logger);

    expect(pluginManager.monitorAdapters).toEqual({
      validType1: testValidAdapter1,
      validType2: testValidAdapter2,
      validType3: testValidAdapter3a,
    });
  });
});
