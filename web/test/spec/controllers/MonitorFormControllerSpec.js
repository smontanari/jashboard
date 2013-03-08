describe("MonitorFormController", function() {
  var scope, controller, listener, workflow;

  describe("'OpenMonitorDialog' event listener", function() {
    beforeEach(function() {
      scope = {
        $on: jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
          listener = handler;
        })
      };
      spyOn(jashboard, "CreateMonitorWorkflow").andReturn({test: "workflow"});

      controller = new jashboard.MonitorFormController(scope, "repository", "pluginManager");
    });
    it("should listen to the 'OpenMonitorDialog' event", function() {
      expect(scope.$on).toHaveBeenCalledWith("OpenMonitorDialog", jasmine.any(Function));
    });
    it("should reset the monitorForm variable in the scope", function() {
      scope.monitorForm = {test: "test"};
      listener({}, "test_dashboard_id");
      expect(scope.monitorForm).toEqual({dashboard_id: "test_dashboard_id", configuration: {}});
    });
    it("should instantiate a new workflow", function() {
      listener({}, "test_dashboard_id");
      expect(jashboard.CreateMonitorWorkflow).toHaveBeenCalledWith(scope, "repository", "pluginManager");
      expect(scope.workflow).toEqual({test: "workflow"});
    });
  });
});

