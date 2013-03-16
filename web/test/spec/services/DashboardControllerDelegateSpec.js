describe("DashboardControllerDelegate", function() {
  var delegate, repository, scope;

  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ['$apply', '$on', '$broadcast']);
    repository = jasmine.createSpyObj("repository", ['loadDashboards']);

    delegate = new jashboard.DashboardControllerDelegate(repository);
  });

  describe("scope.dashboardAction()", function() {
    it("should broadcast the 'OpenMonitorDialog' event", function() {
      delegate.init(scope);
      var innerScope = { dashboard: {id: "test_dashboard_id"} };
      scope.dashboardAction.apply(innerScope, ['newMonitor']);
      expect(scope.$broadcast).toHaveBeenCalledWith("OpenMonitorDialog", "test_dashboard_id");
    });
  });
});
