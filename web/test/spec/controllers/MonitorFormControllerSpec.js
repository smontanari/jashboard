describe("MonitorFormController", function() {
  var scope = {};
  var controller;
  var $stub;
  var repository = {};

  describe("'OpenMonitorDialog' event listener", function() {
    beforeEach(function() {
      scope.$on = jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
        var event = {};
        handler(event, "test_dashboard_id");
      });
      repository.createMonitor = jasmine.createSpy("repository.createMonitor").andCallFake(function(input, handler) {
        handler("test.monitor");
      });
    });
    it("should listen to the 'OpenMonitorDialog' event", function() {
      controller = new jashboard.MonitorFormController(scope, repository);
      expect(scope.$on).toHaveBeenCalledWith("OpenMonitorDialog", jasmine.any(Function));
    });
    it("should reset the monitorForm variable in the scope", function() {
      scope.monitorForm = {test: "test"};
      controller = new jashboard.MonitorFormController(scope, repository);
      expect(scope.monitorForm).toEqual({dashboard_id: "test_dashboard_id"});
    });
    it("should instantiate a new workflow", function() {
      var workflow = spyOn(jashboard, "CreateMonitorWorkflow");
      controller = new jashboard.MonitorFormController(scope, repository);
      expect(workflow).toHaveBeenCalledWith(scope, repository);
    });
  });
});

