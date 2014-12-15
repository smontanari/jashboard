describe("Build MonitorAdapter", function() {
  var plugin;

  beforeEach(function() {
    jashboard.plugin.build.buildTypes = ['buildType1', 'buildType2'];
    _.each(['buildType1', 'buildType2'], function(type) {
      jashboard.plugin.build[type] = {
        parseFormConfiguration: jasmine.createSpy(type + "ConfigurationParser").and.returnValue(
        {
          type: type,
          modelParameter: "test_model_param"
        }
      ),
      convertMonitorConfigurationToFormModel: jasmine.createSpy(type + "ConfigurationConverter").and.returnValue(
        {
          type: type,
          formParameter: "test_form_param"
        }
      )
      };
    });

    plugin = new jashboard.plugin.build.MonitorAdapter();
  });

  _.each(['buildType1', 'buildType2'], function(type) {
    it("should invoke the build configuration form parser of the corresponding type", function() {
      var model = plugin.parseMonitorConfigurationForm({
        type: type,
        hostname: "test.host.name",
        port: "123",
        formParameter: "test_form_param"
      });

      expect(model).toEqual({
        type: type,
        hostname: "test.host.name",
        port: 123,
        modelParameter: "test_model_param"
      });
    });
    it("should invoke the build configuration form converter of the corresponding type", function() {
      var model = plugin.convertMonitorConfigurationToFormModel({
        type: type,
        hostname: "test.host.name",
        port: 123,
        modelParameter: "test_model_param"
      });

      expect(model).toEqual({
        type: type,
        hostname: "test.host.name",
        port: 123,
        formParameter: "test_form_param"
      });
    });
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

