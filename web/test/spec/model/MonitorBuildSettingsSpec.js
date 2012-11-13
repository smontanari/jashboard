describe("MonitorBuildSettings", function() {
  var verifyProperty = function(testData) {
    testCase = testData.testCase || "";
    it("should create a MonitorBuildSettings object with correct " + testData.property + " " + testCase, function() {
      testHelper.verifyObjectProperty(jashboard.model.MonitorBuildSettings, testData);
    });
  };

  describe("Capture build ci server settings", function() {
    _.each([
      { property: "hostname", expectedValue: "test.host.name", data: {type: 1, hostname: "test.host.name"}},
      { property: "port", expectedValue: 123, data: {type: 1, port: 123}},
      {
        testCase: "when server type is Jenkins",
        property: "server",
        expectedValue: "Jenkins",
        data: {type: 1}
      },
      {
        testCase: "when server type is Jenkins",
        property: "build_id",
        expectedValue: "test.build",
        data: {type: 1, build_id: "test.build"}
      },
      {
        testCase: "when server type is GO",
        property: "server",
        expectedValue: "GO",
        data: {type: 2}
      },
      {
        testCase: "when server type is GO",
        property: "pipeline",
        expectedValue: "test.pipeline",
        data: {type: 2, pipeline: "test.pipeline"}
      },
      {
        testCase: "when server type is GO",
        property: "stage",
        expectedValue: "test.stage",
        data: {type: 2, stage: "test.stage"}
      },
      {
        testCase: "when server type is GO",
        property: "job",
        expectedValue: "test.job",
        data: {type: 2, job: "test.job"}
      }
    ], verifyProperty);
  });
});

