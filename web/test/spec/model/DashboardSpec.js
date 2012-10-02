describe("Dashboard", function() {
  var FakeMonitor = function(data) {
    this.monitorId = data.id;
  };
  var verifyProperty = function(testData) {
    it("should create a dashboard object with correct " + testData.property, function() {
      jashboard.testUtils.verifyObjectProperty(jashboard.model.Dashboard, testData);
    });
  };

  describe("Constructor", function() {
    beforeEach(function() {
      spyOn(jashboard.model, "Monitor").andCallFake(FakeMonitor) 
    });
    _.each([
              { property: "id", expectedValue: "test.id", data: {id: "test.id"}},
              { property: "name", expectedValue: "test.name", data: {name: "test.name"}},
              { property: "monitors", expectedValue: [], data: {}}
           ], verifyProperty);

    it("should create monitor objects", function() {
      var dashboard = new jashboard.model.Dashboard({monitorData: [{id: "123"}, {id: "456"}]});
      expect(dashboard.monitors).toEqual([{monitorId: "123"}, {monitorId: "456"}]);
    });
  });
});

