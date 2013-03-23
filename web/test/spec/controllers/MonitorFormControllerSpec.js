describe("MonitorFormController", function() {
  var scope, controller, listener, workflow, repository, pluginManager, monitorLayoutManager;
  beforeEach(function() {
    pluginManager = {
      getAllMonitorTypes: jasmine.createSpy("pluginManager.getAllMonitorTypes()")
        .andReturn(['test_type1', 'test_type2'])
    };    
    scope = {
      $on: jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
        listener = handler;
      })
    };
    monitorLayoutManager = {
      nextAvailableMonitorPosition: sinon.stub()
    };
    repository = jasmine.createSpyObj("repository", ['createMonitor']);
  });

  describe("'OpenMonitorDialog' event listener", function() {
    beforeEach(function() {
      spyOn(jashboard, "CreateMonitorWorkflow").andReturn({test: "workflow"});
      controller = new jashboard.MonitorFormController(scope, repository, pluginManager, monitorLayoutManager);
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
      expect(jashboard.CreateMonitorWorkflow).toHaveBeenCalledWith(jasmine.any(Function));
      expect(scope.workflow).toEqual({test: "workflow"});
    });
  });

  it("should listen to the 'OpenMonitorDialog' event", function() {
    controller = new jashboard.MonitorFormController(scope, null, pluginManager, monitorLayoutManager);

    expect(scope.$on).toHaveBeenCalledWith("OpenMonitorDialog", jasmine.any(Function));
  });
  describe("save action callback", function() {
    var successHandler, errorHandler, saveMonitorCallback, adapter;
    beforeEach(function() {
      scope.$emit = jasmine.createSpy("scope.$emit()");
      scope.$apply = jasmine.createSpy("scope.$apply()");
      spyOn(jashboard, "CreateMonitorWorkflow").andCallFake(function(handler) {
        saveMonitorCallback = handler;
        return {};
      });
      repository.createMonitor = jasmine.createSpy("repository.createMonitor()").andCallFake(function(dashboard_id, monitorParameters, handlers) {
        successHandler = handlers.success;
        errorHandler = handlers.error;
      });
      adapter = {
        validateConfiguration: jasmine.createSpy("validateConfiguration()").andReturn({test: "test_configuration"}),
        defaultSize: function() {return {width: 678, height: 654};}
      };
      pluginManager.findMonitorAdapter = jasmine.createSpy("pluginManager.findMonitorAdapter()").andReturn(adapter);
      monitorLayoutManager.nextAvailableMonitorPosition.withArgs({id: "test_dashboard", monitors: [{id: "m2"}]}, {width: 678, height: 654})
          .returns({top: 123, left: 456});
      scope.dashboards = [
        {id: "dashboard1", monitors: [{id: "m1"}]},
        {id: "test_dashboard", monitors: [{id: "m2"}]}
      ];

      controller = new jashboard.MonitorFormController(scope, repository, pluginManager, monitorLayoutManager);
      listener({}, "test_dashboard_id");
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
      saveMonitorCallback();
    });

    it("should call the repository to create a monitor", function() {
      expect(pluginManager.findMonitorAdapter).toHaveBeenCalledWith("type2");
      expect(adapter.validateConfiguration).toHaveBeenCalledWith("test2");
      expect(repository.createMonitor).toHaveBeenCalledWith(
        "test_dashboard", 
        {
          name: "test.name",
          type: "type2",
          refreshInterval: 123,
          position: {top: 123, left: 456},
          size: {width: 678, height: 654},
          configuration: {test: "test_configuration"}
        }, 
        jasmine.any(Object)
      );
    });
    it("should emit the 'MonitorCreateStart'", function() {
      expect(scope.$emit).toHaveBeenCalledWith("MonitorCreateStart");
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
    it("should emit the 'MonitorCreateComplete'", function() {
      successHandler("test.monitor");
      
      expect(scope.$emit).toHaveBeenCalledWith("MonitorCreateComplete");
    });
    it("should emit the 'CloseMonitorDialog'", function() {
      expect(scope.$emit).toHaveBeenCalledWith("CloseMonitorDialog");
    });
    it("should fire the 'AjaxError' event when failing to save the monitor", function() {
      errorHandler();

      expect(scope.$emit).toHaveBeenCalledWith("AjaxError");
    });
  });
});

