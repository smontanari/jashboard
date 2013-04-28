describe("DashboardActionsHandler", function() {
  var delegate, scope, repository, alertService, timeoutService;

  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ['$broadcast', '$apply']);
    repository = jasmine.createSpyObj("repository", ['deleteDashboard']);
    alertService = jasmine.createSpyObj("alertService", ['showAlert']);
    timeoutService = jasmine.createSpyObj("$timeout", ['cancel']);

    delegate = new jashboard.DashboardActionsHandler(repository, alertService, timeoutService);
    delegate.init(scope);
  });

  describe("scope.dashboardAction(): newMonitor", function() {
    it("should broadcast the 'OpenMonitorDialog' event on 'newMonitor' action", function() {
      var innerScope = { dashboard: "test-dashboard" };

      scope.dashboardAction.apply(innerScope, ['newMonitor']);
      
      expect(scope.$broadcast).toHaveBeenCalledWith("OpenMonitorDialog", {
        mode: jashboard.model.inputOptions.createMode,
        parameters: {dashboard: "test-dashboard"}
      });
    });
  });

  describe("scope.dashboardAction(): editDashboard", function() {
    it("should broadcast the 'OpenDashboardDialog' event on 'editDashboard' action", function() {
      var innerScope = { dashboard: {id: "test_dashboard_id"} };

      scope.dashboardAction.apply(innerScope, ['editDashboard']);
      
      expect(scope.$broadcast).toHaveBeenCalledWith("OpenDashboardDialog", {
        mode: jashboard.model.inputOptions.updateMode,
        parameters: {dashboard: {id: "test_dashboard_id"}}
      });
    });
  });

  describe("scope.dashboardAction(): deleteDashboard", function() {
    var innerScope, currentDashboard, deleteSuccessCallback, deleteErrorCallback, alertOptions, scopeHelperSpy;
    beforeEach(function() {
      currentDashboard = {id: "test_dashboard_id"};
      scope.dashboards = [currentDashboard, {id: "another_dashboard"}];
      innerScope = { dashboard: currentDashboard };
      repository.deleteDashboard.andCallFake(function(id, handlers) {
        deleteSuccessCallback = handlers.success;
        deleteErrorCallback = handlers.error;
      });
      alertService.showAlert.andCallFake(function(options) {
        alertOptions = options;
      });
      scopeHelperSpy = spyOn(jashboard.scopeContextHelper, "setDefaultActiveDashboard");

      scope.dashboardAction.apply(innerScope, ['deleteDashboard']);
    });
    it("should trigger an alert to confirm deletion", function() {
      expect(alertOptions.title).toEqual("Remove dashboard test-dashboard");
      expect(alertOptions.message).toEqual("Deleting this dashboard will also remove all its monitors. Continue?");
      expect(alertOptions.confirmLabel).toEqual("Delete");
    });
    it("should not delete the dashboard if the action is not confirmed", function() {
      expect(repository.deleteDashboard).not.toHaveBeenCalled();
    });

    describe("When delete is confirmed", function() {
      beforeEach(function() {
        alertOptions.confirmAction();
      });
      it("should fire the 'DashboardDeleteStart' event", function() {
        expect(scope.$broadcast).toHaveBeenCalledWith("DashboardDeleteStart");
      });
      it("should delete the dashboard from the repository", function() {
        expect(repository.deleteDashboard).toHaveBeenCalledWith("test_dashboard_id", jasmine.any(Object));
      });
      it("should remove the current dashboard from the scope", function() {
        deleteSuccessCallback();

        expect(scope.dashboards.length).toEqual(1);
        expect(scope.dashboards).toContain({id: "another_dashboard"});
        expect(scope.$apply).toHaveBeenCalled();
      });
      it("should set the current active dashboard", function() {
        deleteSuccessCallback();

        expect(scopeHelperSpy).toHaveBeenCalled();
        expect(scopeHelperSpy.calls[0].object).toEqual(scope);
      });
      it("should cancel the update scheduler for each monitor belonging to the dashboard", function() {
        currentDashboard.monitors = [
          {runtimeUpdateScheduler: {id: "test_scheduler1"}},
          {},
          {runtimeUpdateScheduler: {id: "test_scheduler2"}},
        ];

        deleteSuccessCallback();

        expect(timeoutService.cancel).toHaveBeenCalledWith({id: "test_scheduler1"});
        expect(timeoutService.cancel).toHaveBeenCalledWith({id: "test_scheduler2"});
      });
      it("should fire the 'DashboardDeleteComplete' event", function() {
        deleteSuccessCallback();

        expect(scope.$broadcast).toHaveBeenCalledWith("DashboardDeleteComplete");
      });
      it("should fire the 'AjaxError' event when failing to delete the dashboard", function() {
        deleteErrorCallback();

        expect(scope.$broadcast).toHaveBeenCalledWith("AjaxError");
      });
    });
  });
});
