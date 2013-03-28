describe("commonValidationRules", function() {
  describe("'required' rule", function() {
    it("should return no errors when the value is not empty", function() {
      var errors = jashboard.commonValidationRules.required("test-value");

      expect(errors).toBeEmpty();
    });
    it("should return an error when the value is empty", function() {
      var errors = jashboard.commonValidationRules.required("");

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
      var errors = jashboard.commonValidationRules.positiveNumber("123");

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
});