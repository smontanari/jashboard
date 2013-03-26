describe("ScopeValidationRulesBuilder", function() {
  describe("required rule", function() {
    it("should return no errors when the value is not empty", function() {
      var errors = new jashboard.ScopeValidationRulesBuilder().withRule('required').build()("test-value");

      expect(errors).toBeEmpty();
    });
    it("should return an error when the value is empty", function() {
      var errors = new jashboard.ScopeValidationRulesBuilder().withRule('required').build()("");

      expect(errors).toEqual({required: true});
    });
    it("should return an error when the value is undefined", function() {
      var errors = new jashboard.ScopeValidationRulesBuilder().withRule('required').build()(undefined);

      expect(errors).toEqual({required: true});
    });
  });
  describe("number rule", function() {
    it("should return no errors when the value is a valid number", function() {
      var errors = new jashboard.ScopeValidationRulesBuilder().withRule('number').build()("123");

      expect(errors).toBeEmpty();
    });
    it("should return no error when the value is undefined", function() {
      var errors = new jashboard.ScopeValidationRulesBuilder().withRule('number').build()(undefined);

      expect(errors).toBeEmpty();
    });
    it("should return an error when the value is not a number", function() {
      var errors = new jashboard.ScopeValidationRulesBuilder().withRule('number').build()("abc");

      expect(errors).toEqual({number: "not a number"});
    });
  });
});