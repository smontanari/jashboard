describe("BuildMonitorFormController", function() {
  var scope, monitorRulesConstructor, validatorConstructor, listener;
  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ['$on']);

    monitorRulesConstructor = sinon.stub(jashboard, "BuildMonitorFormValidationRules");
    monitorRulesConstructor.withArgs(scope).returns({id: "buildMonitorRules"});
    formValidator = jasmine.createSpyObj("FormValidator", ['initForm']);
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
    scope.inputMonitor = {
      configuration: {
        build: { type: "test-type1" }
      }
    };

    controller = new jashboard.plugin.build.BuildMonitorFormController(scope);
  });

  afterEach(function() {
    monitorRulesConstructor.restore();
    validatorConstructor.restore();
  });

  it("should put in the scope the different settings types", function() {
    expect(scope.availableBuildSettingsTypes).toEqual(["test_build_type1", "test_build_type2"]);
  });
  it("should listen to the 'OpenMonitorDialog' event", function() {
    expect(scope.$on).toHaveBeenCalledWith("OpenMonitorDialog", jasmine.any(Function));
  });
  it("should set a FormValidator with the build monitor form validation rules in the scope", function() {
    expect(scope.buildMonitorFormValidator).toEqual(formValidator);
  });

  describe("'OpenMonitorDialog' event listener", function() {
    beforeEach(function() {
      scope.buildMonitorForm = "buildMonitorForm";
      listener({});
    });
    it("should init the form validator", function() {
      expect(scope.buildMonitorFormValidator.initForm).toHaveBeenCalledWith("buildMonitorForm");
    });
    it("should reset the inputMonitor.configuration variable in the scope", function() {
      expect(scope.inputMonitor.configuration.build).toEqual({type: "test_build_type1"});
    });
  });
});