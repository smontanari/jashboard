describe("BuildMonitorFormController", function() {
  var scope, monitorRulesConstructor, listener, formValidator;
  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ['$on']);

    monitorRulesConstructor = sinon.stub(jashboard, "BuildMonitorFormValidationRules");
    monitorRulesConstructor.withArgs(scope).returns({id: "buildMonitorRules"});
    formValidator = jasmine.createSpyObj("FormValidator", ['prepareFormForCreate', 'prepareFormForUpdate', 'triggerValidation']);
    spyOn(jashboard, "FormValidator").andReturn(formValidator);
    
    jashboard.plugin.build.buildDataConverter = {
      getAllRegisteredTypes: jasmine.createSpy("buildDataConverter.getAllRegisteredTypes")
        .andReturn(["test_build_type1", "test_build_type2"])
    };
    scope.$on = jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
       listener = handler;
    });
    scope.monitorFormValidator = jasmine.createSpyObj("monitorFormValidator", ['addRules']);
    scope.monitorConfigurationFormModel = {
      build: {type: "test some type"}
    };

    controller = new jashboard.plugin.build.BuildMonitorFormController(scope);
  });

  afterEach(function() {
    monitorRulesConstructor.restore();
  });

  it("should put in the scope the different settings types", function() {
    expect(scope.availableCiServerTypes).toEqual(["test_build_type1", "test_build_type2"]);
  });
  it("should listen to the 'OpenMonitorDialog' event", function() {
    expect(scope.$on).toHaveBeenCalledWith("OpenMonitorDialog", jasmine.any(Function));
  });
  it("should set a FormValidator with the build monitor form validation rules in the scope", function() {
    expect(scope.buildMonitorFormValidator).toEqual(formValidator);
  });

  describe("scope.setCiServerType()", function() {
    it("should set the coniguration build.type", function() {
      scope.setCiServerType("test_type");

      expect(scope.monitorConfigurationFormModel.build.type).toEqual("test_type");
    });
    it("should trigger the input change on the formValidator", function() {
      scope.setCiServerType("test_type");

      expect(formValidator.triggerValidation).toHaveBeenCalled();
    });
  });

  describe("'OpenMonitorDialog' event listener", function() {
    beforeEach(function() {
      scope.formHelper = jasmine.createSpyObj("formHelper", ['registerMonitorTypeForm']);
      scope.buildMonitorForm = "buildMonitorForm";
      scope.monitorConfigurationFormModel = {
        test_type: "test other type",
        build: "test_build"
      };
    });

    describe("create mode", function() {
      beforeEach(function() {
        listener({}, {
          mode: jashboard.inputOptions.createMode,
          parameters: {}
        });
      });
      it("should init the form validator", function() {
        expect(scope.buildMonitorFormValidator.prepareFormForCreate).toHaveBeenCalledWith("buildMonitorForm", {id: "buildMonitorRules"});
      });
      it("should reset the configuration value in the scope", function() {
        expect(scope.monitorConfigurationFormModel.build).toEqual({type: "test_build_type1"});
      });
      it("should register the buildMonitorForm to the formHelper", function() {
        expect(scope.formHelper.registerMonitorTypeForm).toHaveBeenCalledWith("build", "buildMonitorForm");
      });
    });

    describe("update mode when monitor not of type 'build'", function() {
      beforeEach(function() {
        listener({}, {
          mode: jashboard.inputOptions.updateMode,
          parameters: {monitor: {type: 'test_type', configuration: "test_configuration"}}
        });
      });
      it("should not init the form validator", function() {
        expect(scope.buildMonitorFormValidator.prepareFormForUpdate).not.toHaveBeenCalled();
      });
      it("should not update the monitorConfigurationFormModel", function() {
        expect(scope.monitorConfigurationFormModel.build).toEqual("test_build");
      });
    });
    
    describe("update mode when monitor of type 'build'", function() {
      beforeEach(function() {
        listener({}, {
          mode: jashboard.inputOptions.updateMode,
          parameters: {monitor: {type: 'build', configuration: "test_configuration"}}
        });
      });
      it("should init the form validator", function() {
        expect(scope.buildMonitorFormValidator.prepareFormForUpdate).toHaveBeenCalledWith("buildMonitorForm", {id: "buildMonitorRules"});
      });
      it("should update the monitorConfigurationFormModel according to the current monitor configuration", function() {
        expect(scope.monitorConfigurationFormModel.build).toEqual("test_configuration");
      });
      it("should register the buildMonitorForm to the formHelper", function() {
        expect(scope.formHelper.registerMonitorTypeForm).toHaveBeenCalledWith("build", "buildMonitorForm");
      });
    });
  });
});