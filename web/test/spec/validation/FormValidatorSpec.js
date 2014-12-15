describe("FormValidator", function() {
  var formValidator, form, validationRules;
  beforeEach(function() {
    form = {
      input1: {},
      input2: {}
    };
    validationRules = {
      input1: jasmine.createSpy("validationRules.input1").and.returnValue({}),
      input2: jasmine.createSpy("validationRules.input2").and.returnValue({})
    };

    formValidator = new jashboard.FormValidator(form);
  });

  it("should initialise the form fields", function() {
    formValidator.applyRules(validationRules);

    _.each(['input1', 'input2'], function(inputName) {
      expect(form[inputName].$error).toBeEmpty();
    });
  });

  it("should validate the form invoking all validation rules", function() {
    formValidator.applyRules(validationRules);

    expect(validationRules.input1).toHaveBeenCalled();
    expect(validationRules.input2).toHaveBeenCalled();
  });
  it("should set the form as valid when all validation rules succeed", function() {
    formValidator.applyRules(validationRules);

    expect(form.isValid).toBeTruthy();
  });
  it("should set the form as not valid when some validation rules fail", function() {
    var rules = {
      input1: jasmine.createSpy("validationRules.input1").and.returnValue({test: "error"}),
      input2: jasmine.createSpy("validationRules.input2").and.returnValue({})
    };
    formValidator.applyRules(rules);

    expect(form.isValid).toBeFalsy();
  });

  describe("validate()", function() {
    it("should get the error object from the validation rule", function() {
      var rules = {
        input1: jasmine.createSpy("validationRules.input1").and.returnValue({test: "error"}),
        input2: jasmine.createSpy("validationRules.input1").and.returnValue({})
      }

      formValidator.applyRules(rules);
      formValidator.validate(['input1', 'input2']);

      expect(form.input1.$error).toEqual({test: "error"});
      expect(form.input2.$error).toEqual({});
    });
    it("should re-validate the form invoking all validation rules", function() {
      formValidator.applyRules(validationRules);
      formValidator.validate(['input1']);

      expect(validationRules.input1.calls.count()).toEqual(3);
      expect(validationRules.input2.calls.count()).toEqual(2);
    });
    it("should set the form as valid when all validation rules succeed", function() {
      formValidator.applyRules(validationRules);
      formValidator.validate(['input1']);

      expect(form.isValid).toBeTruthy();
    });
    it("should set the form as not valid when some validation rules fail", function() {
      var rules = {
        input1: jasmine.createSpy("rules.input1").and.returnValue({test: "error"}),
        input2: jasmine.createSpy("rules.input2").and.returnValue({})
      }
      rules.input2.and.returnValue({test: "error"});

      formValidator.applyRules(rules);

      formValidator.validate(['input1']);

      expect(form.isValid).toBeFalsy();
    });
  });
});
