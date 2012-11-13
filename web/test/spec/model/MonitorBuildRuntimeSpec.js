describe("MonitorBuildRuntime", function() {
  var verifyProperty = function(testData) {
    testCase = testData.testCase || "";
    it("should create a MonitorBuildRuntime object with correct " + testData.property + " " + testCase, function() {
      testHelper.verifyObjectProperty(jashboard.model.MonitorBuildRuntime, testData);
    });
  };

  describe("Capture build runtime info", function() {
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


