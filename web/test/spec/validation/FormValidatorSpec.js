describe("FormValidator", function() {
  var formValidator, form, validationRules, scope;
  beforeEach(function() {
    form = {
      input1: {},
      input2: {}
    };
    scope = {id: "scope"};
    validationRules = {
      input1: jasmine.createSpy("validationRules.input1").andReturn({}),
      input2: jasmine.createSpy("validationRules.input2").andReturn({})
    };

    formValidator = new jashboard.FormValidator(form, scope);
  });

  it("should initialise the form for create", function() {
    scope.$editMode = jashboard.inputOptions.createMode;
    formValidator.applyRules(validationRules);

    expect(form.$pristine).toBeTruthy();
    expect(form.$dirty).toBeFalsy();
    _.each(['input1', 'input2'], function(inputName) {
      expect(form[inputName].$pristine).toBeTruthy();
      expect(form[inputName].$dirty).toBeFalsy();
      expect(form[inputName].$error).toBeEmpty();
    });
  });

  it("should initialise the form for update", function() {
    scope.$editMode = jashboard.inputOptions.updateMode;
    formValidator.applyRules(validationRules);

    expect(form.$pristine).toBeFalsy();
    expect(form.$dirty).toBeTruthy();
    _.each(['input1', 'input2'], function(inputName) {
      expect(form[inputName].$pristine).toBeFalsy();
      expect(form[inputName].$dirty).toBeTruthy();
      expect(form[inputName].$error).toBeEmpty();
    });
  });

  it("should validate the form invoking all validation rules", function() {
    formValidator.applyRules(validationRules);

    expect(validationRules.input1).toHaveBeenCalledWith(scope);
    expect(validationRules.input2).toHaveBeenCalledWith(scope);
  });
  it("should set the form as valid when all validation rules succeed", function() {
    formValidator.applyRules(validationRules);

    expect(form.isValid).toBeTruthy();
  });
  it("should set the form as not valid when some validation rules fail", function() {
    var rules = {
      input1: jasmine.createSpy("validationRules.input1").andReturn({test: "error"}),
      input2: jasmine.createSpy("validationRules.input2").andReturn({})
    };
    formValidator.applyRules(rules);

    expect(form.isValid).toBeFalsy();
  });

  describe("validate()", function() {
    it("should get the error object from the validation rule", function() {
      var rules = {
        input1: jasmine.createSpy("validationRules.input1").andReturn({test: "error"})
      }

      formValidator.applyRules(rules);
      formValidator.validate('input1');

      expect(form.input1.$error).toEqual({test: "error"});
    });
    it("should re-validate the form invoking all validation rules", function() {
      formValidator.applyRules(validationRules);
      formValidator.validate('input1');

      expect(validationRules.input1.calls.length).toEqual(3);
      expect(validationRules.input2.calls.length).toEqual(2);
    });
    it("should set the form as valid when all validation rules succeed", function() {
      formValidator.applyRules(validationRules);
      formValidator.validate('input1');

      expect(form.isValid).toBeTruthy();
    });
    it("should set the form as not valid when some validation rules fail", function() {
      var rules = {
        input1: jasmine.createSpy("rules.input1").andReturn({test: "error"}),
        input2: jasmine.createSpy("rules.input2").andReturn({})
      }
      rules.input2.andReturn({test: "error"});

      formValidator.applyRules(rules);

      formValidator.validate('input1');

      expect(form.isValid).toBeFalsy();
    });
  });
});
