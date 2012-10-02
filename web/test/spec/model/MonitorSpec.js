describe("Monitor", function() {
  var verifyProperty = function(testData) {
    it("should create a monitor object with correct " + testData.property, function() {
      jashboard.testUtils.verifyObjectProperty(jashboard.model.Monitor, testData);
    });
  };

  describe("Constructor", function() {
  _.each([
            { property: "id", expectedValue: "test.id", data: {id: "test.id"}},
            { property: "type", expectedValue: "build", data: {type: 1}},
            { property: "title", expectedValue: "test.name", data: {name: "test.name"}},
            { property: "lastBuildTime", expectedValue: "test.buildTime", data: {last_build_time: "test.buildTime"}},
            { property: "lastBuildDuration", expectedValue: "02:02", data: {duration: 122}},
            { property: "lastBuildDuration", expectedValue: "12:32", data: {duration: 752}},
            { property: "lastBuildDuration", expectedValue: "01:00:32", data: {duration: 3632}},
            { property: "lastBuildDuration", expectedValue: "02:12:32", data: {duration: 7952}},
            { property: "lastBuildSuccess", expectedValue: true, data: {success: true}},
            { property: "lastBuildSuccess", expectedValue: false, data: {success: false}},
            { property: "lastBuildResult", expectedValue: "success", data: {success: true}},
            { property: "lastBuildResult", expectedValue: "failure", data: {success: false}},
            { property: "currentBuildStatus", expectedValue: "idle", data: {status: 0}},
            { property: "currentBuildStatus", expectedValue: "building", data: {status: 1}}
         ], verifyProperty);
  });
});
