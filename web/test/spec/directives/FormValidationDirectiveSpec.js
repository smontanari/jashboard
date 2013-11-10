describe("FormValidationDirective", function() {
  var scope, listener, validatorConstructor, validator, linkFunction;

  beforeEach(function() {
    jashboard.test = {
      TestRules: jasmine.createSpy().andReturn({id: 'test-rules'})
    };
    scope = jasmine.createSpyObj("scope", ['$on', '$eval']);

    validator = jasmine.createSpyObj("FormValidator", ['validate', 'applyRules', 'prepareFormForUpdate']);

    linkFunction = jashboard.angular.formValidationDirective();
  });

  it("should instantiate the validation rules", function() {
    scope.$formValidator = validator;
    scope.$eval.andCallFake(function(value) {
      if (value === "test-map") return {validationRules: "test.TestRules"};
    });
    linkFunction(scope, "test-element", {jbFormValidation: "test-map"});
    expect(jashboard.test.TestRules).toHaveBeenCalledWith(scope);
  });

  describe("when combined with the ngForm directive", function() {
    beforeEach(function() {
      validatorConstructor = sinon.stub(jashboard, "FormValidator");
      validatorConstructor.withArgs({id: "test-form", input: {}}, scope).returns(validator);
      scope.testForm = {id: "test-form", input: {}};
      scope.$eval.andCallFake(function(value) {
        if (value === "test-map") return {triggerOnEvent: "test-event1", validationRules: "test.TestRules"};
      });

      linkFunction(scope, "test-element", {jbFormValidation: "test-map", ngForm: "testForm"});
    });
    afterEach(function() {
      validatorConstructor.restore();
    });

    it("should set the validator in the scope", function() {
      expect(scope.$formValidator).toEqual(validator);
    });
    it("should use the validator to validate the input fields", function() {
      scope.validateFields("test-input1", "test-input2");

      expect(validator.validate).toHaveBeenCalledWith(["test-input1", "test-input2"]);
    });

    describe("scope.inputInError()", function() {
      it("should return undefined if the form has not been yet initialised", function() {
        expect(scope.inputInError('test-input')).toBeUndefined();
      });
      it("should return input in error if with an error", function() {
        scope.testForm.input.$error = {test: "error"};

        expect(scope.inputInError('input')).toBeTruthy();
      });
      it("should return input not in error if with no errors", function() {
        scope.testForm.input.$error = {};

        expect(scope.inputInError('input')).toBeFalsy();
      });
    });
  });

  describe("triggerOnLoad", function() {
    beforeEach(function() {
      scope.$formValidator = validator;
    });
    _.each([{validationRules: "test.TestRules"}, {validationRules: "test.TestRules", triggerOnLoad: true}], function(attributes) {
      it("should apply the validation rules to the validator when not defined or true", function() {
        scope.$eval.andCallFake(function(value) {
          if (value === "test-map") return attributes;
        });
        
        linkFunction(scope, "test-element", {jbFormValidation: "test-map"});

        expect(validator.applyRules).toHaveBeenCalledWith({id: "test-rules"});
      });
    });
    it("should not apply the validation rules to the validator when false", function() {
      scope.$eval.andCallFake(function(value) {
        if (value === "test-map") return {validationRules: "test.TestRules", triggerOnLoad: false};
      });
      
      linkFunction(scope, "test-element", {jbFormValidation: "test-map"});

      expect(validator.applyRules).not.toHaveBeenCalled();
    });
  });

  describe("triggerOnEvent event listener", function() {
    beforeEach(function() {
      scope.$formValidator = validator;
      scope.$eval.andCallFake(function(value) {
        if (value === "test-map") return {triggerOnEvent: "test-event1", validationRules: "test.TestRules"};
      });
      scope.$on.andCallFake(function(name, handler) {
        if (name === "test-event1") listener = handler;
      });
      
      linkFunction(scope, "test-element", {jbFormValidation: "test-map"});
    });

    it("should apply the validation rules to the validator", function() {
      listener({});

      expect(validator.applyRules).toHaveBeenCalledWith({id: "test-rules"});
    });
  });
});
