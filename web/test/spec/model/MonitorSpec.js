describe("Monitor", function() {
  var verifyProperty = function(testData) {
    testCase = testData.testCase || "";
    it("should create a monitor object with correct " + testData.property + " " + testCase, function() {
      testHelper.verifyObjectProperty(jashboard.model.Monitor, testData);
    });
  };

  describe("Capture monitor basic info", function() {
    _.each([
            { property: "id", expectedValue: "test.id", data: {id: "test.id", ciserver_settings: {type: 1}, runtime_info: {}}},
            { property: "type", expectedValue: "build", data: {type: 1, ciserver_settings: {type: 1}, runtime_info: {}}},
            { property: "title", expectedValue: "test.name", data: {name: "test.name", ciserver_settings: {type: 1}, runtime_info: {}}}
    ], verifyProperty);
  });

  describe("Capture monitor ci server settings", function() {
    _.each([
      {
        testCase: "when server type is Jenkins",
        property: "ciServerSettings",
        expectedValue: {server: "Jenkins", hostname: "test.host.name", port: 123, build_id: "test.build"},
        data: {ciserver_settings: {type: 1, hostname: "test.host.name", port: 123, build_id: "test.build"}, runtime_info: {}}
      },
      {
        testCase: "when server type is GO",
        property: "ciServerSettings",
        expectedValue: {server: "GO", hostname: "test.host.name", port: 123, pipeline: "test.pipeline", stage: "test.stage", job: "test.job"},
        data: {ciserver_settings: {type: 2, hostname: "test.host.name", port: 123, pipeline: "test.pipeline", stage: "test.stage", job: "test.job"}, runtime_info: {}}
      },
    ], verifyProperty);
  });

  describe("Capture monitor runtime info", function() {
    _.each([
            { property: "lastBuildTime", expectedValue: "test.buildTime", data: {ciserver_settings: {type: 1}, runtime_info: {last_build_time: "test.buildTime"}}},
            { testCase: "when runtime info is not available", property: "lastBuildTime", expectedValue: "n/a", data: {ciserver_settings: {type: 1}, runtime_info: {}}},
            { property: "lastBuildDuration", expectedValue: "02:02", data: {ciserver_settings: {type: 1}, runtime_info: {duration: 122}}},
            { testCase: "when runtime info is not available" , property: "lastBuildDuration", expectedValue: "n/a", data: {ciserver_settings: {type: 1}, runtime_info: {}}},
            { testCase: "when build successful", property: "lastBuildSuccess", expectedValue: true, data: {ciserver_settings: {type: 1}, runtime_info: {success: true}}},
            { testCase: "when build not successful", property: "lastBuildSuccess", expectedValue: false, data: {ciserver_settings: {type: 1}, runtime_info: {success: false}}},
            { testCase: "when runtime info is not available", property: "lastBuildSuccess", expectedValue: "n/a", data: {ciserver_settings: {type: 1}, runtime_info: {}}},
            { testCase: "when build successful", property: "lastBuildResult", expectedValue: "success", data: {ciserver_settings: {type: 1}, runtime_info: {success: true}}},
            { testCase: "when build not successful", property: "lastBuildResult", expectedValue: "failure", data: {ciserver_settings: {type: 1}, runtime_info: {success: false}}},
            { testCase: "when runtime info is not available", property: "lastBuildResult", expectedValue: "n/a", data: {ciserver_settings: {type: 1}, runtime_info: {}}},
            { testCase: "when status is idle", property: "currentBuildStatus", expectedValue: "idle", data: {ciserver_settings: {type: 1}, runtime_info: {status: 0}}},
            { testCase: "when status is building", property: "currentBuildStatus", expectedValue: "building", data: {ciserver_settings: {type: 1}, runtime_info: {status: 1}}},
            { testCase: "when runtime info is not available", property: "currentBuildStatus", expectedValue: "n/a", data: {ciserver_settings: {type: 1}, runtime_info: {}}}
    ], verifyProperty);
  });
});
