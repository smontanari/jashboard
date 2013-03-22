describe("DashboardFormController", function() {
  var scope, controller;
  var repository = {};

  describe("'OpenDashboardDialog' event listener", function() {
    beforeEach(function() {
      scope = {};
      scope.$on = jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
        handler();
      });
    });
    it("should reset the dashboardForm variable in the scope", function() {
      scope.dashboardName = "test";
      controller = new jashboard.DashboardFormController(scope, repository);
      expect(scope.dashboardName).toEqual("");
    });
    it("should set the validation error to false", function() {
      controller = new jashboard.DashboardFormController(scope, repository);
      expect(scope.validationError).toBeFalsy();      
    });
  });

  describe("form validation", function() {
    beforeEach(function() {
      scope = jasmine.createSpyObj("scope", ['$on']);
      repository.createDashboard = jasmine.createSpy("repository.createDashboard()");
      controller = new jashboard.DashboardFormController(scope, repository);
      scope.dashboardName = "";
      scope.saveDashboard();
    });

    it("should set the validation error to true", function() {
      expect(scope.validationError).toBeTruthy();
    });
    it("should not invoke the repository", function() {
      expect(repository.createDashboard).not.toHaveBeenCalled();
    });
  });

  describe("saveDashboard()", function() {
    var successHandler, errorHandler, scope;
    beforeEach(function() {
      scope = jasmine.createSpyObj("scope", ['$on', '$emit', '$apply', '$broadcast']);
      scope.dashboards = [{id: "some dashbaord"}];
      scope.context = {};
      repository.createDashboard = jasmine.createSpy("repository.createDashboard()").andCallFake(function(input, handlers) {
        successHandler = handlers.success;
        errorHandler = handlers.error;
      });
      controller = new jashboard.DashboardFormController(scope, repository);

      scope.dashboardName = "test.name";
      scope.saveDashboard();
    });

    it("should call the repository to create a dashboard", function() {
      expect(repository.createDashboard).toHaveBeenCalledWith({name: "test.name"}, jasmine.any(Object));
    });
    it("should add the dashboard to the scope", function() {
      successHandler({id: "test.dashboard"});

      expect(scope.dashboards.length).toEqual(2);
      expect(scope.dashboards).toContain({id: "test.dashboard"});
      expect(scope.$apply).toHaveBeenCalled();
    });
    it("should set the current active dashboard", function() {
      successHandler({id: "test_dashboard"});
      
      expect(scope.context.activeDashboardId).toEqual("test_dashboard");
    });
    it("should emit the 'DashboardCreateComplete' if successful", function() {
      successHandler("test.dashboard");
      expect(scope.$emit).toHaveBeenCalledWith("DashboardCreateComplete", "test.dashboard");
    });
    it("should emit the 'DashboardCreateStart' if successful", function() {
      expect(scope.$emit).toHaveBeenCalledWith("DashboardCreateStart");
    });
    it("should fire the 'AjaxError' event when failing to save the dashboard", function() {
      errorHandler();

      expect(scope.$emit).toHaveBeenCalledWith("AjaxError");
    });
  });
});
