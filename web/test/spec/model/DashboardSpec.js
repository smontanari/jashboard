describe("Dashboard", function() {
  var verifyProperty = function(testData) {
    it("should create a dashboard object with correct " + testData.property, function() {
      testHelper.verifyObjectProperty(jashboard.model.Dashboard, testData);
    });
  };

  describe("Constructor", function() {
    _.each([
              { property: "id", expectedValue: "test.id", data: {id: "test.id"}},
              { property: "name", expectedValue: "test.name", data: {name: "test.name"}},
              { property: "monitors", expectedValue: [], data: {}}
           ], verifyProperty);
  });
});

