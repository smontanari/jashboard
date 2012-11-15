describe("DashboardFormController", function() {
  var scope;
  var controller;
  var $stub;
  var repository = {};
  var dialogWidget = {};

  var resetScope = function() {
    scope = jasmine.createSpyObj("scope", ['$emit']);
  };

  beforeEach(function() {
    resetScope();
    $stub = testHelper.stubJQuery(["#new-dashboard-form", dialogWidget]);
    $stub.modal = jasmine.createSpy("$.modal()");
  });

  describe("resetForm", function() {
    it("should reset the dashboardForm variable in the scope", function() {
      controller = new jashboard.DashboardFormController(scope, repository);
      scope.dashboardForm = {test: "test"};

      scope.resetForm();

      expect(scope.dashboardForm).toEqual({});
    });
  });

  describe("saveDashboard", function() {
    beforeEach(function() {
      repository.createDashboard = jasmine.createSpy("repository.createDashboard").andCallFake(function(input, handler) {
        handler("test.dashboard");
      });
      controller = new jashboard.DashboardFormController(scope, repository);

      scope.dashboardForm = {name: "test.name"};
      scope.saveDashboard();
    });

    it("should call the repository to create a dashboard", function() {
      expect(repository.createDashboard).toHaveBeenCalledWith({name: "test.name"}, jasmine.any(Function));
    });
    it("should emit the 'NewDashboardEvent'", function() {
      expect(scope.$emit).toHaveBeenCalledWith("NewDashboardEvent", "test.dashboard");
    });
    it("should close the dialog", function() {
      expect($stub.modal).toHaveBeenCalledWith("hide");
    });
  });
});
