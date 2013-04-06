describe("FormValidationDirective", function() {
  var scope, listener, validatorConstructor, validator, linkFunction;

  beforeEach(function() {
    jashboard.test = {
      TestRules: function() {
        this.id = "test-rules";
      }
    };
    scope = jasmine.createSpyObj("scope", ['$on', '$eval']);

    validator = jasmine.createSpyObj("FormValidator", ['validate', 'applyRules', 'prepareFormForUpdate']);

    linkFunction = jashboard.angular.formValidationDirective();
  });

  describe("when combined with the ngForm directive", function() {
    beforeEach(function() {
      validatorConstructor = sinon.stub(jashboard, "FormValidator");
      validatorConstructor.withArgs({id: "test-form", input: {}}, scope).returns(validator);
      scope.testForm = {id: "test-form", input: {}};
      scope.$eval.andCallFake(function(value) {
        if (value === "test-map") return {triggerOn: "test-event1", validationRules: "test.TestRules"};
      });

      linkFunction(scope, "test-element", {jbFormValidation: "test-map", ngForm: "testForm"});
    });
    afterEach(function() {
      validatorConstructor.restore();
    });

    it("should set the validator in the scope", function() {
      expect(scope.$formValidator).toEqual(validator);
    });
    it("should use the validator to validate the input field", function() {
      scope.validateField("test-input");

      expect(validator.validate).toHaveBeenCalledWith("test-input");
    });

    describe("scope.inputInError()", function() {
      it("should return undefined if the form has not been yet initialised", function() {
        expect(scope.inputInError('test-input')).toBeUndefined();
      });
      it("should return input in error if dirty and with an error", function() {
        scope.testForm.input.$dirty = true;
        scope.testForm.input.$error = {test: "error"};

        expect(scope.inputInError('input')).toBeTruthy();
      });
      it("should return input not in error if not dirty", function() {
        scope.testForm.input.$dirty = false;
        scope.testForm.input.$error = {test: "error"};

        expect(scope.inputInError('input')).toBeFalsy();
      });
      it("should return input not in error if with no errors", function() {
        scope.testForm.input.$dirty = true;
        scope.testForm.input.$error = {};

        expect(scope.inputInError('input')).toBeFalsy();
      });
    });
  });

  describe("triggerOn not defined", function() {
    beforeEach(function() {
      scope.$formValidator = validator;
      scope.$eval.andCallFake(function(value) {
        if (value === "test-map") return {validationRules: "test.TestRules"};
      });
      
      linkFunction(scope, "test-element", {jbFormValidation: "test-map"});
    });

    it("should apply the validation rules to the validator", function() {
      expect(validator.applyRules).toHaveBeenCalledWith({id: "test-rules"});
    });
  });

  describe("triggerOn event listener", function() {
    beforeEach(function() {
      scope.$formValidator = validator;
      scope.$eval.andCallFake(function(value) {
        if (value === "test-map") return {triggerOn: "test-event1", validationRules: "test.TestRules"};
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
