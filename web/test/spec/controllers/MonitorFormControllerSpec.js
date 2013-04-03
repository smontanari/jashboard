describe("MonitorFormController", function() {
  var scope, controller, listener, formHelper, repository, pluginManager, monitorLayoutManager,
      monitorRulesConstructor, validatorConstructor;
  beforeEach(function() {
    pluginManager = {
      getAllMonitorTypes: jasmine.createSpy("pluginManager.getAllMonitorTypes()")
        .andReturn(['test_type1', 'test_type2'])
    };    
    scope = jasmine.createSpyObj("scope", ['$on', '$emit', '$apply']);

    monitorRulesConstructor = sinon.stub(jashboard, "MonitorFormValidationRules");
    monitorRulesConstructor.withArgs(scope).returns({id: "monitorRules"});
    formValidator = jasmine.createSpyObj("FormValidator", ['prepareForm']);
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
  it("should initialise the monitorConfigurationData object in the scope", function() {
    expect(scope.monitorConfigurationData).toEqual({});
  });

  describe("'OpenMonitorDialog' event listener", function() {
    beforeEach(function() {
      spyOn(jashboard, "CreateMonitorFormHelper").andReturn({test: "formHelper"});
      scope.baseMonitorForm = "baseMonitorForm";
      scope.baseMonitorData = {test: "test"};
    });

    it("should put a new formHelper in the scope", function() {
      listener({}, {
        mode: "",
        parameters: {monitor: {}}
      });

      expect(jashboard.CreateMonitorFormHelper).toHaveBeenCalledWith(scope.baseMonitorForm, scope.baseMonitorData, jasmine.any(Function));
      expect(scope.formHelper).toEqual({test: "formHelper"});
    });
    describe("create mode", function() {
      beforeEach(function() {
        listener({}, {
          mode: jashboard.inputOptions.createMode,
          parameters: {dashboard_id: "test_dashboard_id"}
        });
      });
      it("should init the form validator", function() {
        expect(formValidator.prepareForm).toHaveBeenCalledWith("baseMonitorForm", true);
      });
      it("should reset the input variables in the scope", function() {
        expect(scope.dashboard_id).toEqual("test_dashboard_id");
        expect(scope.baseMonitorData).toEqual({
          id: null,
          name: null,
          refreshInterval: null,
          type: "test_type1"
        });
        expect(scope.monitorConfigurationData).toEqual({
          test_type1: {},
          test_type2: {}
        });
      });
      it("should set the editMode variable as 'create' in the scope", function() {
        expect(scope.editMode).toEqual(jashboard.inputOptions.createMode);
      });
    });

    describe("update mode", function() {
      beforeEach(function() {
        listener({}, {
          mode: jashboard.inputOptions.updateMode,
          parameters: {monitor: {
            id: "test_monitor_id",
            name: "test_name",
            type: "test_type",
            refreshInterval: 123,
            configuration: "test_configuration",
            runtimeInfo: "test_runtime_info"
          }}
        });
      });
      it("should init the form validator", function() {
        expect(formValidator.prepareForm).toHaveBeenCalledWith("baseMonitorForm", false);
      });
      it("should update the input variables in the scope", function() {
        expect(scope.dashboard_id).toBeNull();
        expect(scope.baseMonitorData).toEqual({
          id: "test_monitor_id",
          name: "test_name",
          type: "test_type",
          refreshInterval: 123
        });
      });
      it("should set the editMode variable as 'update' in the scope", function() {
        expect(scope.editMode).toEqual(jashboard.inputOptions.updateMode);
      });
    });
  });

  describe("save action callback", function() {
    var successHandler, errorHandler, saveMonitorCallback, adapter;
    beforeEach(function() {
      spyOn(jashboard, "CreateMonitorFormHelper").andCallFake(function(form, model, handler) {
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
        getMonitorConfiguration: jasmine.createSpy("getMonitorConfiguration()").andReturn({test: "test_configuration"}),
        defaultSize: function() {return {width: 678, height: 654};}
      };
      pluginManager.findMonitorAdapter = jasmine.createSpy("pluginManager.findMonitorAdapter()").andReturn(adapter);
      monitorLayoutManager.nextAvailableMonitorPosition.withArgs({id: "test_dashboard", monitors: [{id: "m2"}]}, {width: 678, height: 654})
          .returns({top: 123, left: 456});

      controller = new jashboard.MonitorFormController(scope, repository, pluginManager, monitorLayoutManager);
      listener({}, {
        mode: jashboard.inputOptions.createMode,
        parameters: {dashboard_id: "test_dashboard_id"}
      });
    });
    
    describe("Form data evaluation", function() {
      it("should call the repository to create a monitor with parameters from the input form", function() {
        scope.dashboard_id = "test_dashboard";
        scope.baseMonitorData = {
          name: "test.name",
          refreshInterval: "123",
          type: "type2"
        };
        scope.monitorConfigurationData = {
          type1: "test1",
          type2: "test2"
        };
        saveMonitorCallback();

        expect(pluginManager.findMonitorAdapter).toHaveBeenCalledWith("type2");
        expect(adapter.getMonitorConfiguration).toHaveBeenCalledWith("test2");
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
      it("should pass NaN for refreshInterval if not provided", function() {
        scope.baseMonitorData = {
          name: "test.name",
          refreshInterval: "",
          type: "type2"
        };
        scope.monitorConfigurationData = {
          build: {
            type1: "test1",
            type2: "test2"
          }
        };
        saveMonitorCallback();
        expect(repository.createMonitor.mostRecentCall.args[1].refreshInterval).toBeNaN();
      });
    });

    describe("Data model update", function() {
      it("should add the monitor to the dashboard", function() {
        scope.dashboard_id = "test_dashboard";
        scope.baseMonitorData = {};
        saveMonitorCallback();

        successHandler("test.monitor");

        expect(scope.dashboards[0].monitors.length).toEqual(1);
        expect(scope.dashboards[1].monitors.length).toEqual(2);
        expect(scope.dashboards[1].monitors).toContain("test.monitor");
      });
    });

    describe("Event handling", function() {
      beforeEach(function() {
        scope.dashboard_id = "test_dashboard";
        scope.baseMonitorData = {};
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

