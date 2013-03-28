describe("MonitorFormController", function() {
  var scope, controller, listener, workflow, repository, pluginManager, monitorLayoutManager,
      monitorRulesConstructor, validatorConstructor;
  beforeEach(function() {
    pluginManager = {
      getAllMonitorTypes: jasmine.createSpy("pluginManager.getAllMonitorTypes()")
        .andReturn(['test_type1', 'test_type2'])
    };    
    scope = jasmine.createSpyObj("scope", ['$on', '$emit', '$apply']);

    monitorRulesConstructor = sinon.stub(jashboard, "MonitorFormValidationRules");
    monitorRulesConstructor.withArgs(scope).returns({id: "monitorRules"});
    formValidator = jasmine.createSpyObj("FormValidator", ['initForm']);
    validatorConstructor = sinon.stub(jashboard, "FormValidator");
    validatorConstructor.withArgs({id: "monitorRules"}).returns(formValidator);
    
    scope.$on.andCallFake(function(eventName, handler) {
      listener = handler;
    });
    monitorLayoutManager = {
      nextAvailableMonitorPosition: sinon.stub()
    };
    repository = jasmine.createSpyObj("repository", ['createMonitor']);

    controller = new jashboard.MonitorFormController(scope, repository, pluginManager, monitorLayoutManager);
  });
  afterEach(function() {
    validatorConstructor.restore();
    monitorRulesConstructor.restore();
  });

  it("should inject the array of available monitor types into the scope", function() {
    expect(scope.availableMonitorTypes).toEqual(["test_type1", "test_type2"]);
  });

  it("should listen to the 'OpenMonitorDialog' event", function() {
    expect(scope.$on).toHaveBeenCalledWith("OpenMonitorDialog", jasmine.any(Function));
  });
  it("should set a FormValidator with the monitor form validation rules in the scope", function() {
    expect(scope.monitorFormValidator).toEqual(formValidator);
  });

  describe("'OpenMonitorDialog' event listener", function() {
    beforeEach(function() {
      spyOn(jashboard, "CreateMonitorWorkflow").andReturn({test: "workflow"});
      scope.monitorForm = "monitorForm";
      scope.inputMonitor = {test: "test"};

      listener({}, "test_dashboard_id");
    });
  
    it("should init the form validator", function() {
      expect(formValidator.initForm).toHaveBeenCalledWith("monitorForm");
    });
    it("should reset the inputMonitor variable in the scope", function() {
      expect(scope.inputMonitor).toEqual({dashboard_id: "test_dashboard_id", configuration: {}});
    });
    it("should instantiate a new workflow", function() {
      expect(jashboard.CreateMonitorWorkflow).toHaveBeenCalledWith(jasmine.any(Function));
      expect(scope.workflow).toEqual({test: "workflow"});
    });
  });

  describe("save action callback", function() {
    var successHandler, errorHandler, saveMonitorCallback, adapter;
    beforeEach(function() {
      spyOn(jashboard, "CreateMonitorWorkflow").andCallFake(function(handler) {
        saveMonitorCallback = handler;
        return {};
      });
      scope.dashboards = [
        {id: "dashboard1", monitors: [{id: "m1"}]},
        {id: "test_dashboard", monitors: [{id: "m2"}]}
      ];
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

      controller = new jashboard.MonitorFormController(scope, repository, pluginManager, monitorLayoutManager);
      listener({}, "test_dashboard_id");
    });
    
    describe("Form data validation", function() {
      it("should call the repository to create a monitor with parameters form the input form", function() {
        scope.inputMonitor = {
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
      it("should use a default value of 0 for refreshInterval if not provided", function() {
        scope.inputMonitor = {
          dashboard_id: "test_dashboard", 
          name: "test.name",
          refreshInterval: undefined,
          type: "type2",
          configuration: {
            type1: "test1",
            type2: "test2"
          }
        };
        saveMonitorCallback();

        expect(repository.createMonitor).toHaveBeenCalledWith(
          "test_dashboard", 
          {
            name: "test.name",
            type: "type2",
            refreshInterval: 0,
            position: {top: 123, left: 456},
            size: {width: 678, height: 654},
            configuration: {test: "test_configuration"}
          }, 
          jasmine.any(Object)
        );
      });
    });

    describe("Data model update", function() {
      it("should add the monitor to the dashboard", function() {
        scope.inputMonitor = {
          dashboard_id: "test_dashboard", 
          configuration: {}
        };
        saveMonitorCallback();

        successHandler("test.monitor");

        expect(scope.dashboards[0].monitors.length).toEqual(1);
        expect(scope.dashboards[1].monitors.length).toEqual(2);
        expect(scope.dashboards[1].monitors).toContain("test.monitor");
      });
    });

    describe("Event handling", function() {
      beforeEach(function() {
        scope.inputMonitor = {
          dashboard_id: "test_dashboard", 
          configuration: {}
        };
        saveMonitorCallback();
      });
      it("should emit the 'MonitorCreateStart'", function() {
        expect(scope.$emit).toHaveBeenCalledWith("MonitorCreateStart");
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
});

