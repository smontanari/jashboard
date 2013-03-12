describe("MonitorFormController", function() {
  var scope, controller, listener, workflow, pluginManager;
  beforeEach(function() {
    pluginManager = {
      getAllMonitorTypes: jasmine.createSpy("pluginManager.getAllMonitorTypes()")
        .andReturn(['test_type1', 'test_type2'])
    };    
  });

  describe("'OpenMonitorDialog' event listener", function() {
    beforeEach(function() {
      scope = {
        $on: jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
          listener = handler;
        })
      };
      spyOn(jashboard, "CreateMonitorWorkflow").andReturn({test: "workflow"});

      controller = new jashboard.MonitorFormController(scope, "repository", pluginManager);
    });
    it("should inject the array of available monitor types into the scope", function() {
      expect(scope.availableMonitorTypes).toEqual(["test_type1", "test_type2"]);
    });
    it("should reset the monitorForm variable in the scope", function() {
      scope.monitorForm = {test: "test"};
      listener({}, "test_dashboard_id");
      expect(scope.monitorForm).toEqual({dashboard_id: "test_dashboard_id", configuration: {}});
    });
    it("should instantiate a new workflow", function() {
      listener({}, "test_dashboard_id");
      expect(jashboard.CreateMonitorWorkflow).toHaveBeenCalledWith(scope, "repository", pluginManager);
      expect(scope.workflow).toEqual({test: "workflow"});
    });
  });

  it("should listen to the 'OpenMonitorDialog' event", function() {
    controller = new jashboard.MonitorFormController(scope, null, pluginManager);

    expect(scope.$on).toHaveBeenCalledWith("OpenMonitorDialog", jasmine.any(Function));
  });
});

