describe("commonValidationRules", function() {
  describe("'noValidation' rule", function() {
    it("should return no errors", function() {
      var errors = jashboard.commonValidationRules.noValidation("test-value");

      expect(errors).toBeEmpty();
    });
  });
  describe("'required' rule", function() {
    it("should return no errors when the value is a number", function() {
      var errors = jashboard.commonValidationRules.required(123);

      expect(errors).toBeEmpty();
    });
    it("should return no errors when the value is a non empty string", function() {
      var errors = jashboard.commonValidationRules.required("test-value");

      expect(errors).toBeEmpty();
    });
    it("should return an error when the value is an empty string", function() {
      var errors = jashboard.commonValidationRules.required("");

      expect(errors).toEqual({required: true});
    });
    it("should return an error when the value is null", function() {
      var errors = jashboard.commonValidationRules.required(null);

      expect(errors).toEqual({required: true});
    });
    it("should return an error when the value is undefined", function() {
      var errors = jashboard.commonValidationRules.required(undefined);

      expect(errors).toEqual({required: true});
    });
  });
  describe("'number' rule", function() {
    it("should return no errors when the value is a valid number", function() {
      var errors = jashboard.commonValidationRules.number("123");

      expect(errors).toBeEmpty();
    });
    it("should return no error when the value is undefined", function() {
      var errors = jashboard.commonValidationRules.number(undefined);

      expect(errors).toBeEmpty();
    });
    it("should return an error when the value is not a number", function() {
      var errors = jashboard.commonValidationRules.number("123abc");

      expect(errors).toEqual({number: true});
    });
  });
  describe("'positiveNumber'", function() {
    it("should return no errors when the value is not a number", function() {
      var errors = jashboard.commonValidationRules.positiveNumber("");

      expect(errors).toBeEmpty();
    });
    it("should return no errors when the value is a positive number", function() {
      var errors = jashboard.commonValidationRules.positiveNumber("123.345");

      expect(errors).toBeEmpty();
    });
    it("should return an error when the value is 0", function() {
      var errors = jashboard.commonValidationRules.positiveNumber("0");

      expect(errors).toEqual({positiveNumber: true});
    });
    it("should return an error when the value is negative", function() {
      var errors = jashboard.commonValidationRules.positiveNumber("-123");

      expect(errors).toEqual({positiveNumber: true});
    });
  });
  describe("'positiveInteger'", function() {
    it("should return no errors when the value is not a number", function() {
      var errors = jashboard.commonValidationRules.positiveInteger("");

      expect(errors).toBeEmpty();
    });
    it("should return no errors when the value is a positive integer", function() {
      var errors = jashboard.commonValidationRules.positiveInteger("123");

      expect(errors).toBeEmpty();
    });
    it("should return an error when the value is 0", function() {
      var errors = jashboard.commonValidationRules.positiveInteger("0");

      expect(errors).toEqual({positiveInteger: true});
    });
    it("should return an error when the value is negative", function() {
      var errors = jashboard.commonValidationRules.positiveInteger("-123");

      expect(errors).toEqual({positiveInteger: true});
    });
  });
});