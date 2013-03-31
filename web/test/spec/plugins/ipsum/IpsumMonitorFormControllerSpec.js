describe("IpsumMonitorFormController", function() {
  var controller, scope, eventListener, monitorRulesConstructor, validatorConstructor, formValidator;

  beforeEach(function() {
    scope = {
      $on: jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
        eventListener = handler;
      })
    };
    monitorRulesConstructor = sinon.stub(jashboard, "IpsumMonitorFormValidationRules");
    monitorRulesConstructor.withArgs(scope).returns({id: "ipsumMonitorRules"});
    formValidator = jasmine.createSpyObj("FormValidator", ['initForm']);
    validatorConstructor = sinon.stub(jashboard, "FormValidator");
    validatorConstructor.withArgs({id: "ipsumMonitorRules"}).returns(formValidator);

    controller = new jashboard.plugin.ipsum.IpsumMonitorFormController(scope);
  });
  afterEach(function() {
    monitorRulesConstructor.restore();
    validatorConstructor.restore();
  });

  it("should put in the scope the different languages", function() {
    expect(scope.availableLanguages).toEqual(["english", "french", "latin"]);
  });
  it("should set a FormValidator with the ipsum monitor form validation rules in the scope", function() {
    expect(scope.ipsumMonitorFormValidator).toEqual(formValidator);
  });
  it("should listen to the 'OpenMonitorDialog' event", function() {
    expect(scope.$on).toHaveBeenCalledWith("OpenMonitorDialog", jasmine.any(Function));
  });

  describe("'OpenMonitorDialog' event listener", function() {
    beforeEach(function() {
      scope.inputMonitor = {
        configuration: {
          ipsum: {
            language: "test-language"
          }
        }
      };
      scope.ipsumMonitorForm = "ipsumMonitorForm";
      scope.formHelper = jasmine.createSpyObj("formHelper", ['registerMonitorTypeForm']);

      eventListener({});
    });
    it("should init the form validator", function() {
      expect(scope.ipsumMonitorFormValidator.initForm).toHaveBeenCalledWith("ipsumMonitorForm");
    });
    it("should register the ipsumMonitorForm to the formHelper", function() {
      expect(scope.formHelper.registerMonitorTypeForm).toHaveBeenCalledWith("ipsum", "ipsumMonitorForm");
    });
    it("should reset the inputMonitor.configuration variable in the scope", function() {
      expect(scope.inputMonitor.configuration.ipsum).toEqual({language: "english"});
    });
  });
});