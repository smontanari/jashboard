describe("DashboardActionsHandler", function() {
  var delegate, scope, repository, alertService;

  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ['$broadcast']);
    repository = jasmine.createSpyObj("repository", ['deleteDashboard']);
    alertService = jasmine.createSpyObj("alertService", ['showAlert']);

    delegate = new jashboard.DashboardActionsHandler(repository, alertService);
    delegate.init(scope);
  });

  describe("scope.dashboardAction(): newMonitor", function() {
    it("should broadcast the 'OpenMonitorDialog' event on 'newMonitor' action", function() {
      var innerScope = { dashboard: {id: "test_dashboard_id"} };

      scope.dashboardAction.apply(innerScope, ['newMonitor']);
      
      expect(scope.$broadcast).toHaveBeenCalledWith("OpenMonitorDialog", "test_dashboard_id");
    });
  });
  describe("scope.dashboardAction(): delete", function() {
    var innerScope, deleteSuccessCallback, alertOptions;
    beforeEach(function() {
      innerScope = { dashboard: {id: "test_dashboard_id", name: "test-dashboard"} };      
      repository.deleteDashboard.andCallFake(function(id, handlers) {
        deleteSuccessCallback = handlers.success;
      });
      alertService.showAlert.andCallFake(function(options) {
        alertOptions = options;
      });
      scope.dashboardAction.apply(innerScope, ['delete']);
    });
    it("should trigger an alert to confirm deletion", function() {
      expect(alertOptions.title).toEqual("Remove dashboard test-dashboard");
      expect(alertOptions.message).toEqual("Deleting this dashboard will also remove all its monitors. Continue?");
      expect(alertOptions.confirmLabel).toEqual("Delete");
    });
    it("should not delete the dashboard if the action is not confirmed", function() {
      expect(repository.deleteDashboard).not.toHaveBeenCalled();
    });
    it("should delete the dashboard from the repository", function() {
      alertOptions.confirmAction();

      expect(repository.deleteDashboard).toHaveBeenCalledWith("test_dashboard_id", jasmine.any(Object));
    });
    it("should broadcast the 'RemoveDashboard' event", function() {
      alertOptions.confirmAction();
      deleteSuccessCallback();

      expect(scope.$broadcast).toHaveBeenCalledWith("RemoveDashboard", {id: "test_dashboard_id", name: "test-dashboard"});
    });
  });
});
