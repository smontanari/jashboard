describe("DashboardFormValidationRules", function() {
  var rules, scopeRulesContructor, scopeRules, scope;
  beforeEach(function() {
    scope = {id: "scope"};

    scopeRules = {
      required: sinon.stub()
    };
    scopeRulesContructor = sinon.stub(jashboard, "ScopeValidationRules");
    scopeRulesContructor.withArgs(scope).returns(scopeRules);
  });

  afterEach(function() {
    scopeRulesContructor.restore();
  });

  it("should validate the 'dashboardName' field with the 'required' rule", function() {
    var validationFn = function() {return "test_validation_result"; };
    scopeRules.required.withArgs("dashboardName").returns(validationFn);

    rules = new jashboard.DashboardFormValidationRules(scope);

    expect(rules.dashboardName()).toEqual("test_validation_result");
  });
});