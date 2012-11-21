describe("Monitor", function() {
  var verifyProperty = function(testData) {
    testCase = testData.testCase || "";
    it("should create a monitor object with correct " + testData.property + " " + testCase, function() {
      testHelper.verifyObjectProperty(jashboard.model.Monitor, testData);
    });
  };

  beforeEach(function() {
    jashboard.types.monitorSettingsTypeAdapter.toObject = jasmine.createSpy("jashboard.types.monitorSettingsTypeAdapter.toObject()").andCallFake(function(data) {
      return {buildSettings: data.settings};
    });
  });

  describe("Capture monitor generic data", function() {
    _.each([
            { property: "id", expectedValue: "test.id", data: {id: "test.id", type: 1, settings: {}}},
            { property: "title", expectedValue: "test.name", data: {name: "test.name", type: 1, settings: {}}},
            { property: "type", expectedValue: 1, data: {type: 1}},
            { property: "refreshInterval", expectedValue: 123, data: {refresh_interval: 123, type: 1, settings: {}}},
            { property: "runtimeInfo", expectedValue: {}, data: {type: 1, settings: {}}}
    ], verifyProperty);
  });

  describe("Capture settings data", function() {
    it("should create a build settings object", function() {
      var monitor = new jashboard.model.Monitor({type: 1, settings: "test.settings"});

      expect(monitor.settings).toEqual({buildSettings: "test.settings"});
    });
  });
});
