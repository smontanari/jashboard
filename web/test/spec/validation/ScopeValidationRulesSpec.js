describe("ScopeValidationRules", function() {
  var rules, scope;

  beforeEach(function() {
    scope = {};
    rules = new jashboard.ScopeValidationRules(scope);
  });

  describe("required rule", function() {
    it("should return no errors when the value is not empty", function() {
      scope.testForm = { testModel: "test-value" };

      var errors = rules.required("testForm.testModel")();

      expect(errors).toBeEmpty();
    });
    it("should return an error when the value is empty", function() {
      scope.testForm = { testModel: "" };

      var errors = rules.required("testForm.testModel")();

      expect(errors).toEqual({required: true});
    });
    it("should return an error when the value is undefined", function() {
      var errors = rules.required("testForm.testModel")();

      expect(errors).toEqual({required: true});
    });
  });
  describe("number rule", function() {
    it("should return no errors when the value is a valid number", function() {
      scope.testForm = { testModel: "123" };

      var errors = rules.number("testForm.testModel")();

      expect(errors).toBeEmpty();
    });
    it("should return no error when the value is undefined", function() {
      var errors = rules.number("testForm.testModel")();

      expect(errors).toBeEmpty();
    });
    it("should return an error when the value is not a number", function() {
      scope.testForm = { testModel: "abc" };

      var errors = rules.number("testForm.testModel")();

      expect(errors).toEqual({number: "not a number"});
    });
  });
});