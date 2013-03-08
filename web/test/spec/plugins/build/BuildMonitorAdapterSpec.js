describe("BuildMonitorAdapter", function() {
  var plugin, mockTypeAdapter;

  beforeEach(function() {
    mockTypeAdapter = jasmine.createSpyObj("typeAdapter", ["registerTypeHandler", "toObject"]);
    spyOn(jashboard.plugin, "TypeAdapter").andReturn(mockTypeAdapter);
    plugin = new jashboard.plugin.build.BuildMonitorAdapter();
  });

  it("should add itself to the plugin manager", function() {
    expect(jashboard.plugin.pluginManager.findMonitorAdapter('build')).toBeDefined();
  });

  it("should invoke a build configuration type handler", function() {
    plugin.parseConfiguration("test");

    expect(mockTypeAdapter.toObject).toHaveBeenCalledWith("test");
  });

  it("should create a buildConfigurationParser at initialisation", function() {
    plugin.init();
    expect(jashboard.plugin.build.buildConfigurationParser).toBeDefined();
  });

  it("should invoke a build configuration validator", function() {
    plugin.validateConfiguration("test");

    expect(mockTypeAdapter.toObject).toHaveBeenCalledWith("test");
  });

  it("should create a buildConfigurationValidator at initialisation", function() {
    plugin.init();
    expect(jashboard.plugin.build.buildConfigurationValidator).toBeDefined();
  });

  describe("monitor runtime handler", function() {
    var verifyProperty = function(testData) {
      testCase = testData.testCase || "";
      it("should create a build runtime object with correct " + testData.property + " " + testCase, function() {
        var runtimeInfo = plugin.parseRuntimeInfo(testData.data);
        expect(runtimeInfo[testData.property]).toEqual(testData.expectedValue);
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

