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
    var successHandler, scope;
    beforeEach(function() {
      scope = jasmine.createSpyObj("scope", ['$on', '$emit', '$apply']);
      scope.dashboards = [];
      repository.createDashboard = jasmine.createSpy("repository.createDashboard()").andCallFake(function(input, handlers) {
        successHandler = handlers.success;
      });
      controller = new jashboard.DashboardFormController(scope, repository);

      scope.dashboardName = "test.name";
      scope.saveDashboard();
    });

    it("should call the repository to create a dashboard", function() {
      expect(repository.createDashboard).toHaveBeenCalledWith({name: "test.name"}, jasmine.any(Object));
    });
    it("should add the dashboard to the scope", function() {
      successHandler("test.dashboard");
      expect(scope.dashboards.length).toEqual(1);
      expect(scope.dashboards).toContain("test.dashboard");
      expect(scope.$apply).toHaveBeenCalled();
    });
    it("should emit the 'DashboardSavingComplete' if successful", function() {
      successHandler("test.dashboard");
      expect(scope.$emit).toHaveBeenCalledWith("DashboardSavingComplete", "test.dashboard");
    });
    it("should emit the 'DashboardSavingStart' if successful", function() {
      expect(scope.$emit).toHaveBeenCalledWith("DashboardSavingStart");
    });
  });
});
