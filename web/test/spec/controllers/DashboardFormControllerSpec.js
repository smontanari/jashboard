describe("DashboardFormController", function() {
  var scope;
  var controller;
  var dialogService;
  var repository = {};

  beforeEach(function() {
    dialogService = jasmine.createSpyObj("DialogService", ["showModal", "hideModal"]);
  });

  describe("'OpenDashboardDialog' event listener", function() {
    beforeEach(function() {
      scope = {};
      scope.$on = jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
        handler();
      });
    });
    it("should open the modal dialog", function() {
      controller = new jashboard.DashboardFormController(scope, repository, dialogService);
      expect(scope.$on).toHaveBeenCalledWith("OpenDashboardDialog", jasmine.any(Function));
      expect(dialogService.showModal).toHaveBeenCalledWith("#new-dashboard-form");
    });
    it("should reset the dashboardForm variable in the scope", function() {
      scope.dashboardName = "test";
      controller = new jashboard.DashboardFormController(scope, repository, dialogService);
      expect(scope.dashboardName).toEqual("");
    });
  });

  describe("saveDashboard", function() {
    beforeEach(function() {
      scope = jasmine.createSpyObj("scope", ['$on', '$emit']);
      repository.createDashboard = jasmine.createSpy("repository.createDashboard").andCallFake(function(input, handler) {
        handler("test.dashboard");
      });
      controller = new jashboard.DashboardFormController(scope, repository, dialogService);

      scope.dashboardName = "test.name";
      scope.saveDashboard();
    });

    it("should call the repository to create a dashboard", function() {
      expect(repository.createDashboard).toHaveBeenCalledWith({name: "test.name"}, jasmine.any(Function));
    });
    it("should emit the 'NewDashboardCreated'", function() {
      expect(scope.$emit).toHaveBeenCalledWith("NewDashboardCreated", "test.dashboard");
    });
    it("should close the dialog", function() {
      expect(dialogService.hideModal).toHaveBeenCalledWith("#new-dashboard-form");
    });
  });
});
