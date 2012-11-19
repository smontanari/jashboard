describe("DashboardActionsController", function() {
  var scope;
  var controller;

  describe("Dashboard actions", function() {
    beforeEach(function() {
      scope = jasmine.createSpyObj("scope", ["$broadcast"]);
      controller = new jashboard.DashboardActionsController(scope);
    });

    it("should broadcast the 'OpenMonitorDialog' event", function() {
      scope.actionNewMonitor();
      expect(scope.$broadcast).toHaveBeenCalledWith("OpenMonitorDialog");
    });
  });
});


