describe("Dashboard", function() {
  var verifyProperty = function(testData) {
    it("should create a dashboard object with correct " + testData.property, function() {
      testHelper.verifyObjectProperty(jashboard.model.Dashboard, testData);
    });
  };

  describe("A new empty dashboard", function() {
    _.each([
              { property: "id", expectedValue: "test.id", data: {id: "test.id"}},
              { property: "name", expectedValue: "test.name", data: {name: "test.name"}},
              { property: "monitors", expectedValue: [], data: {}}
           ], verifyProperty);
  });

  describe("A dashboard with monitors", function() {
    it("should create monitor objects", function() {
      spyOn(jashboard.model, "Monitor").andCallFake(function(data) {
        this.monitorName = data.name;
      });
      var dashboard = new jashboard.model.Dashboard({
        monitors: [
          {name: "test.monitor.1", type: 1},
          {name: "test.monitor.2", type: 1},
      ]});

      expect(dashboard.monitors.length).toEqual(2);
      expect(dashboard.monitors).toContain({monitorName: "test.monitor.1"});
      expect(dashboard.monitors).toContain({monitorName: "test.monitor.2"});
    });
  });
});

