describe("DashboardActionsController", function() {
  var scope;
  var controller;

  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ["$broadcast"]);
    controller = new jashboard.DashboardActionsController(scope);
  });

  describe("actionNewMonitor()", function() {
    it("should broadcast the 'OpenMonitorDialog' event", function() {
      scope.dashboard = {id: "test_dashboard_id"};
      scope.actionNewMonitor();
      expect(scope.$broadcast).toHaveBeenCalledWith("OpenMonitorDialog", "test_dashboard_id");
    });
  });
});
