describe("BuildMonitorPlugin", function() {
  var mockSettingsHandler;
  var mockRuntimeHandler;
  var plugin;

  beforeEach(function() {
    jashboard.types.monitorSettingsTypeManager.registerTypeHandler = jasmine.createSpy("monitorSettingsTypeManager.registerTypeHandler").andCallFake(function(id, handler) {
      mockSettingsHandler = handler;
    });
    jashboard.types.monitorRuntimeTypeManager.registerTypeHandler = jasmine.createSpy("monitorRuntimeTypeManager.registerTypeHandler").andCallFake(function(id, handler) {
      mockRuntimeHandler = handler;
    });
    new jashboard.plugin.BuildMonitorPlugin().initialize();
  });

  it("should register a monitor settings type handler", function() {
    expect(jashboard.types.monitorSettingsTypeManager.registerTypeHandler).toHaveBeenCalledWith(1, mockSettingsHandler);
  });
  it("should define a buildSettingsTypeManager", function() {
    expect(jashboard.types.buildSettingsTypeManager).toBeDefined();
  });
  it("should register a monitor runtime type handler", function() {
    expect(jashboard.types.monitorRuntimeTypeManager.registerTypeHandler).toHaveBeenCalledWith(1, mockRuntimeHandler);
  });

  describe("monitor settings handler", function() {
    it("should return the build settings data", function() {
      jashboard.types.buildSettingsTypeManager.toObject = jasmine.createSpy("jashboard.types.buildSettingsTypeManager.toObject()").andCallFake(function(data) {
        return {buildSettings: data};
      });
      var settings = mockSettingsHandler({type: 1, settings: "test.settings"});

      expect(settings).toEqual({buildSettings: "test.settings"});
    });
  });

  describe("monitor runtime handler", function() {
    var verifyProperty = function(testData) {
      testCase = testData.testCase || "";
      it("should create a build runtime object with correct " + testData.property + " " + testCase, function() {
        var obj = mockRuntimeHandler(testData.data);
        expect(obj[testData.property]).toEqual(testData.expectedValue);
      });
    };
    _.each([
            { property: "lastBuildTime", expectedValue: "test.buildTime", data: {last_build_time: "test.buildTime"}},
            { testCase: "when runtime info is not available", property: "lastBuildTime", expectedValue: "n/a", data: {}},
            { property: "lastBuildDuration", expectedValue: "02:02", data: {duration: 122}},
            { testCase: "when runtime info is not available" , property: "lastBuildDuration", expectedValue: "n/a", data: {}},
            { testCase: "when build successful", property: "lastBuildSuccess", expectedValue: true, data: {success: true}},
            { testCase: "when build not successful", property: "lastBuildSuccess", expectedValue: false, data: {success: false}},
            { testCase: "when runtime info is not available", property: "lastBuildSuccess", expectedValue: "n/a", data: {}},
            { testCase: "when build successful", property: "lastBuildResult", expectedValue: "success", data: {success: true}},
            { testCase: "when build not successful", property: "lastBuildResult", expectedValue: "failure", data: {success: false}},
            { testCase: "when runtime info is not available", property: "lastBuildResult", expectedValue: "n/a", data: {}},
            { testCase: "when status is idle", property: "currentBuildStatus", expectedValue: "idle", data: {status: 0}},
            { testCase: "when status is building", property: "currentBuildStatus", expectedValue: "building", data: {status: 1}},
            { testCase: "when runtime info is not available", property: "currentBuildStatus", expectedValue: "n/a", data: {}}
    ], verifyProperty);
  });
});

