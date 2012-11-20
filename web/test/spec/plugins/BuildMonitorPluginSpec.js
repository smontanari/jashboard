describe("BuildMonitorPlugin", function() {
  var mockHandler;
  var plugin;

  beforeEach(function() {
    jashboard.types.monitorSettingsTypeManager.registerTypeHandler = jasmine.createSpy("monitorSettingsTypeManager.registerTypeHandler").andCallFake(function(id, handler) {
      mockHandler = handler;
    });
    new jashboard.plugin.BuildMonitorPlugin().initialize();
  });

  it("should register a build monitor type handler", function() {
    expect(jashboard.types.monitorSettingsTypeManager.registerTypeHandler).toHaveBeenCalledWith(1, mockHandler);
  });
  it("should define a buildSettingsTypeManager", function() {
    expect(jashboard.types.buildSettingsTypeManager).toBeDefined();
  });
  it("should return the build settings data", function() {
    jashboard.types.buildSettingsTypeManager.toObject = jasmine.createSpy("jashboard.types.buildSettingsTypeManager.toObject()").andCallFake(function(data) {
      return {buildSettings: data};
    });
    var settings = mockHandler({type: 1, settings: "test.settings"});

    expect(settings).toEqual({buildSettings: "test.settings"});
  });
});

