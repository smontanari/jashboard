describe("BuildMonitorFormController", function() {
  var scope, monitorRulesConstructor, validatorConstructor, listener, formValidator;
  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ['$on']);

    monitorRulesConstructor = sinon.stub(jashboard, "BuildMonitorFormValidationRules");
    monitorRulesConstructor.withArgs(scope).returns({id: "buildMonitorRules"});
    formValidator = jasmine.createSpyObj("FormValidator", ['prepareForm', 'onInputChange']);
    validatorConstructor = sinon.stub(jashboard, "FormValidator");
    validatorConstructor.withArgs({id: "buildMonitorRules"}).returns(formValidator);
    
    jashboard.plugin.build.buildConfigurationParser = {
      getAllRegisteredTypes: jasmine.createSpy("buildConfigurationParser.getAllRegisteredTypes")
        .andReturn(["test_build_type1", "test_build_type2"])
    };
    scope.$on = jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
       listener = handler;
    });
    scope.monitorFormValidator = jasmine.createSpyObj("monitorFormValidator", ['addRules']);
    scope.monitorConfigurationData = {
      build: {type: "test some type"}
    };

    controller = new jashboard.plugin.build.BuildMonitorFormController(scope);
  });

  afterEach(function() {
    monitorRulesConstructor.restore();
    validatorConstructor.restore();
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

      expect(scope.monitorConfigurationData.build.type).toEqual("test_type");
    });
    it("should trigger the input change on the formValidator", function() {
      scope.setCiServerType("test_type");

      expect(formValidator.onInputChange).toHaveBeenCalled();
    });
  });

  describe("'OpenMonitorDialog' event listener", function() {
    beforeEach(function() {
      scope.formHelper = jasmine.createSpyObj("formHelper", ['registerMonitorTypeForm']);
      scope.buildMonitorForm = "buildMonitorForm";
      scope.monitorConfigurationData = {
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
        expect(scope.buildMonitorFormValidator.prepareForm).toHaveBeenCalledWith("buildMonitorForm", true);
      });
      it("should reset the configuration value in the scope", function() {
        expect(scope.monitorConfigurationData.build).toEqual({type: "test_build_type1"});
      });
      it("should register the buildMonitorForm to the formHelper", function() {
        expect(scope.formHelper.registerMonitorTypeForm).toHaveBeenCalledWith("build", "buildMonitorForm");
      });
    });
    xdescribe("update mode when monitor of type 'build'", function() {
      beforeEach(function() {
        listener({}, {
          mode: jashboard.inputOptions.updateMode,
          parameters: {monitor: {type: 'build'}}
        });
      });
      it("should init the form validator", function() {
        expect(scope.buildMonitorFormValidator.prepareForm).toHaveBeenCalledWith("buildMonitorForm", false);
      });
      it("should register the buildMonitorForm to the formHelper", function() {
        expect(scope.formHelper.registerMonitorTypeForm).toHaveBeenCalledWith("build", "buildMonitorForm");
      });
    });
  });
});