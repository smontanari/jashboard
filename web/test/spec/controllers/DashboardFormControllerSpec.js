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
  });

  describe("saveDashboard", function() {
    beforeEach(function() {
      scope = jasmine.createSpyObj("scope", ['$on', '$emit']);
      repository.createDashboard = jasmine.createSpy("repository.createDashboard").andCallFake(function(input, handler) {
        handler("test.dashboard");
      });
      controller = new jashboard.DashboardFormController(scope, repository);

      scope.dashboardName = "test.name";
      scope.saveDashboard();
    });

    it("should call the repository to create a dashboard", function() {
      expect(repository.createDashboard).toHaveBeenCalledWith({name: "test.name"}, jasmine.any(Function));
    });
    it("should emit the 'NewDashboardCreated'", function() {
      expect(scope.$emit).toHaveBeenCalledWith("NewDashboardCreated", "test.dashboard");
    });
  });
});
