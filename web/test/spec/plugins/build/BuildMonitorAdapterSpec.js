describe("BuildMonitorAdapter", function() {
  var plugin, mockTypeAdapter, configData, configForm, configModel;

  beforeEach(function() {
    mockTypeAdapter = {
      toObject: sinon.stub()
    };
    spyOn(jashboard.plugin, "TypeAdapter").andReturn(mockTypeAdapter);
    plugin = new jashboard.plugin.build.BuildMonitorAdapter();
    configModel = {
      type: "test_type",
      hostname: "test.host.name",
      port: 123,
      modelParameter: "test_model_param"
    };
    configForm = {
      type: "test_type",
      hostname: "test.host.name",
      port: "123",
      formParameter: "test_form_param"
    };
  });

  it("should add itself to the plugin manager", function() {
    expect(jashboard.plugin.pluginManager.findMonitorAdapter('build')).toBeDefined();
  });

  it("should invoke a build configuration form parser", function() {
    mockTypeAdapter.toObject.withArgs({type: "test_type", formParameter: "test_form_param"}).returns({type: "test_type", modelParameter: "test_model_param"});

    var model = plugin.parseMonitorConfigurationForm(configForm);

    expect(model).toEqual(configModel);
  });

  it("should create a configuration form parser at initialisation", function() {
    plugin.init();
    expect(jashboard.plugin.build.buildConfigurationFormParser).toBeDefined();
  });

  it("should return a default size for the build monitor", function() {
    var size = plugin.defaultSize();

    expect(size).toEqual({width: 240, height: 140});
  });

  describe("monitor runtime handler", function() {
    var verifyProperty = function(testData) {
      testCase = testData.testCase || "";
      it("should create a build runtime object with correct " + testData.property + " " + testCase, function() {
        var runtimeInfo = plugin.convertDataToRuntimeInfo(testData.data);
        expect(runtimeInfo[testData.property]).toEqual(testData.expectedValue);
      });
    };
    _.each([
            { property: "lastBuildTime", expectedValue: "28-08-2012 21:25:10", data: {lastBuildTime: "2012-08-28 21:25:10 +1000"}},
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

