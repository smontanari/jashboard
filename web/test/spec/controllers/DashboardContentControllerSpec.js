describe("DashboardContentController", function() {
  var scope;
  var controller;

  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ["$broadcast"]);
    controller = new jashboard.DashboardContentController(scope);
  });

  describe("Dashboard actions", function() {
    it("should broadcast the 'OpenMonitorDialog' event", function() {
      scope.dashboard = {id: "test_dashboard_id"};
      scope.actionNewMonitor();
      expect(scope.$broadcast).toHaveBeenCalledWith("OpenMonitorDialog", "test_dashboard_id");
    });
  });
});
