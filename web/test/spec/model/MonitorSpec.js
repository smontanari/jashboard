describe("Monitor", function() {
  var verifyProperty = function(testData) {
    it("should create a monitor object with correct " + testData.property, function() {
      testHelper.verifyObjectProperty(jashboard.model.Monitor, testData);
    });
  };

  describe("Constructor from JSON object", function() {
  _.each([
            { property: "id", expectedValue: "test.id", data: {id: "test.id", runtime_info: {}}},
            { property: "type", expectedValue: "build", data: {type: 1, runtime_info: {}}},
            { property: "title", expectedValue: "test.name", data: {name: "test.name", runtime_info: {}}},
            { property: "lastBuildTime", expectedValue: "test.buildTime", data: {runtime_info: {last_build_time: "test.buildTime"}}},
            { property: "lastBuildDuration", expectedValue: "02:02", data: {runtime_info: {duration: 122}}},
            { property: "lastBuildDuration", expectedValue: "12:32", data: {runtime_info: {duration: 752}}},
            { property: "lastBuildDuration", expectedValue: "01:00:32", data: {runtime_info: {duration: 3632}}},
            { property: "lastBuildDuration", expectedValue: "02:12:32", data: {runtime_info: {duration: 7952}}},
            { property: "lastBuildSuccess", expectedValue: true, data: {runtime_info: {success: true}}},
            { property: "lastBuildSuccess", expectedValue: false, data: {runtime_info: {success: false}}},
            { property: "lastBuildResult", expectedValue: "success", data: {runtime_info: {success: true}}},
            { property: "lastBuildResult", expectedValue: "failure", data: {runtime_info: {success: false}}},
            { property: "currentBuildStatus", expectedValue: "idle", data: {runtime_info: {status: 0}}},
            { property: "currentBuildStatus", expectedValue: "building", data: {runtime_info: {status: 1}}}
         ], verifyProperty);
  });
});
