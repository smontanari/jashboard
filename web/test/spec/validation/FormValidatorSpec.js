describe("FormValidator", function() {
  var formValidator, form, validationRules;

  describe("Initialisation", function() {
    beforeEach(function() {
      form = {
        input1: {},
        input2: {}
      };
      validationRules = {
        input1: jasmine.createSpy("validationRules.input1").andReturn({}),
        input2: jasmine.createSpy("validationRules.input2").andReturn({})
      };
    });

    it("should initialise the form attributes", function() {
      formValidator = new jashboard.FormValidator({});
      formValidator.initForm(form);

      expect(form.$pristine).toBeTruthy();
      expect(form.$dirty).toBeFalsy();
    });
    it("should initialise the input fields", function() {
      formValidator = new jashboard.FormValidator(validationRules);
      formValidator.initForm(form);
      
      _.each(['input1', 'input2'], function(inputName) {
        expect(form[inputName].$pristine).toBeTruthy();
        expect(form[inputName].$dirty).toBeFalsy();
        expect(form[inputName].$error).toBeEmpty();
      });
    });
    it("should validate the form invoking all validation rules", function() {
      formValidator = new jashboard.FormValidator(validationRules);
      formValidator.initForm(form);

      expect(validationRules.input1).toHaveBeenCalled();
      expect(validationRules.input2).toHaveBeenCalled();
    });
    it("should set the form as valid when all validation rules succeed", function() {
      formValidator = new jashboard.FormValidator(validationRules);
      formValidator.initForm(form);

      expect(form.isValid).toBeTruthy();
    });
    it("should set the form as not valid when some validation rules fail", function() {
      var rules = {
        input1: jasmine.createSpy("validationRules.input1").andReturn({test: "error"}),
        input2: jasmine.createSpy("validationRules.input2").andReturn({})
      };
      formValidator = new jashboard.FormValidator(rules);
      formValidator.initForm(form);

      expect(form.isValid).toBeFalsy();
    });
  });

  describe("onInputChange()", function() {
    it("should get the error object from the validation rule", function() {
      var rules = {
        input1: jasmine.createSpy("validationRules.input1").andReturn({test: "error"})
      }

      formValidator = new jashboard.FormValidator(rules);
      formValidator.initForm(form);
      formValidator.onInputChange('input1');

      expect(form.input1.$error).toEqual({test: "error"});
    });
    it("should re-validate the form invoking all validation rules", function() {
      formValidator = new jashboard.FormValidator(validationRules);
      formValidator.initForm(form);
      formValidator.onInputChange('input1');

      expect(validationRules.input1.calls.length).toEqual(3);
      expect(validationRules.input2.calls.length).toEqual(2);
    });
    it("should set the form as valid when all validation rules succeed", function() {
      formValidator = new jashboard.FormValidator(validationRules);
      formValidator.initForm(form);
      formValidator.onInputChange('input1');

      expect(form.isValid).toBeTruthy();
    });
    it("should set the form as not valid when some validation rules fail", function() {
      var validationRules = {
        input1: jasmine.createSpy("validationRules.input1").andReturn({test: "error"}),
        input2: jasmine.createSpy("validationRules.input2").andReturn({})
      }

      validationRules.input2.andReturn({test: "error"});
      formValidator = new jashboard.FormValidator(validationRules);
      formValidator.initForm(form);

      formValidator.onInputChange('input1');

      expect(form.isValid).toBeFalsy();
    });
  });
  
  describe("inputInError()", function() {
    it("should return undefined if the form has not been yet initialised", function() {
      formValidator = new jashboard.FormValidator({});

      expect(formValidator.inputInError('test_intpu')).toBeUndefined();
    });
    it("should return input in error if dirty and with an error", function() {
      formValidator = new jashboard.FormValidator({});
      formValidator.initForm(form);

      form.input2.$dirty = true;
      form.input2.$error = {test: "error"};

      expect(formValidator.inputInError('input2')).toBeTruthy();
    });
    it("should return input not in error if not dirty", function() {
      formValidator = new jashboard.FormValidator({});
      formValidator.initForm(form);

      form.input2.$dirty = false;
      form.input2.$error = {test: "error"};

      expect(formValidator.inputInError('input2')).toBeFalsy();
    });
    it("should return input not in error if with no errors", function() {
      formValidator = new jashboard.FormValidator({});
      formValidator.initForm(form);

      form.input2.$dirty = true;
      form.input2.$error = {};

      expect(formValidator.inputInError('input2')).toBeFalsy();
    });
  });
});
