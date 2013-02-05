describe("DashboardFormController", function() {
  var scope;
  var controller;
  var $stub;
  var repository = {};

  beforeEach(function() {
    $stub = testHelper.stubJQuery(["#new-dashboard-form"]);
    $stub.on = jasmine.createSpy("$.on()");
    $stub.modal = jasmine.createSpy("$.modal()");
  });

  describe("'OpenDashboardDialog' event listener", function() {
    beforeEach(function() {
      scope = {};
      scope.$on = jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
        handler();
      });
    });
    it("should open the modal dialog", function() {
      controller = new jashboard.DashboardFormController(scope, repository);
      expect(scope.$on).toHaveBeenCalledWith("OpenDashboardDialog", jasmine.any(Function));
      expect($stub.modal).toHaveBeenCalledWith("show");
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
    it("should emit the 'NewDashboardEvent'", function() {
      expect(scope.$emit).toHaveBeenCalledWith("NewDashboardEvent", "test.dashboard");
    });
    it("should close the dialog", function() {
      expect($stub.modal).toHaveBeenCalledWith("hide");
    });
  });
});
