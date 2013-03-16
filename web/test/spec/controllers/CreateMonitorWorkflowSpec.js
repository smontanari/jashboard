describe("CreateMonitorWorkflow", function() {
  var workflow, scope, repository, pluginManager;

  beforeEach(function() {
    scope = {};
    repository = {};
    pluginManager = {};
    workflow = new jashboard.CreateMonitorWorkflow(scope, repository, pluginManager);
  });

  it("should have one initial action equal to 'next'", function() {
    expect(workflow.actions).toEqual(["next"]);
  })
  it("should have the state equal to 'showGenericConfiguration'", function() {
    expect(workflow.state).toEqual("showGenericConfiguration");
  });

  describe("Action: next", function() {
    beforeEach(function() {
      workflow['next']();
    });
    it("should have the state equal to 'showSelectedConfiguration'", function() {
      expect(workflow.state).toEqual("showSelectedConfiguration");
    })
    it("should have two actions: 'back' and 'save'", function() {
      expect(workflow.actions).toEqual(["back", "save"]);
    })
  });

  describe("Action: back", function() {
    beforeEach(function() {
      workflow['next']();
      workflow['back']();
    });
    it("should have the state equal to 'showGenericConfiguration'", function() {
      expect(workflow.state).toEqual("showGenericConfiguration");
    })
    it("should have one initial action equal to 'Next'", function() {
      expect(workflow.actions).toEqual(["next"]);
    })
  });

  describe("Action: save", function() {
    var successHandler, adapter;
    beforeEach(function() {
      scope.$emit = jasmine.createSpy("scope.$emit()");
      scope.$apply = jasmine.createSpy("scope.$apply()");
      repository.createMonitor = jasmine.createSpy("repository.createMonitor()").andCallFake(function(dashboard_id, monitorParameters, handlers) {
        successHandler = handlers.success;
      });
      adapter = {
        validateConfiguration: jasmine.createSpy("validateConfiguration()").andReturn({test: "test_configuration"})
      };
      pluginManager.findMonitorAdapter = jasmine.createSpy("pluginManager.findMonitorAdapter()").andReturn(adapter);
      scope.monitorForm = {
        dashboard_id: "test_dashboard", 
        name: "test.name",
        refreshInterval: "123",
        type: "type2",
        configuration: {
          type1: "test1",
          type2: "test2"
        }
      };
      scope.dashboards = [
        {id: "dashboard1", monitors: [{id: "m1"}]},
        {id: "test_dashboard", monitors: [{id: "m2"}]}
      ];
      workflow.save();
    });

    it("should call the repository to create a monitor", function() {
      expect(pluginManager.findMonitorAdapter).toHaveBeenCalledWith("type2");
      expect(adapter.validateConfiguration).toHaveBeenCalledWith("test2");
      expect(repository.createMonitor).toHaveBeenCalledWith(
        "test_dashboard", 
        {name: "test.name", type: "type2", refreshInterval: 123, configuration: {test: "test_configuration"}}, 
        jasmine.any(Object)
      );
    });
    it("should emit the 'MonitorSavingStart'", function() {
      expect(scope.$emit).toHaveBeenCalledWith("MonitorSavingStart");
    });
    it("should add the monitor to the dashboard", function() {
      successHandler("test.monitor");

      expect(scope.dashboards[0].monitors.length).toEqual(1);
      expect(scope.dashboards[1].monitors.length).toEqual(2);
      expect(scope.dashboards[1].monitors).toContain("test.monitor");
    });
    it("should syncronise the scope", function() {
      successHandler("test.monitor");

      expect(scope.$apply).toHaveBeenCalled();
    });
    it("should emit the 'NewMonitorCreated'", function() {
      successHandler("test.monitor");
      
      expect(scope.$emit).toHaveBeenCalledWith("NewMonitorCreated");
    });
    it("should emit the 'CloseMonitorDialog'", function() {
      expect(scope.$emit).toHaveBeenCalledWith("CloseMonitorDialog");
    });
  });
});