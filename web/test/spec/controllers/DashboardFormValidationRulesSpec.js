describe("DashboardFormValidationRules", function() {
  var rules, rulesRulesContructor, scopeRules, scope;
  beforeEach(function() {
    scope = {id: "scope"};

    scopeRules = {
      required: jasmine.createSpy("ScopeValidationRules.required()").andReturn("required() impl")
    };
    rulesRulesContructor = sinon.stub(jashboard, "ScopeValidationRules");
    rulesRulesContructor.withArgs(scope).returns(scopeRules);
    
    rules = new jashboard.DashboardFormValidationRules(scope);
  });

  afterEach(function() {
    rulesRulesContructor.restore();
  });

  it("should validate the 'dashboardName' field with the 'required' rule", function() {
    expect(scopeRules.required).toHaveBeenCalledWith("dashboardName");
    expect(rules.dashboardName).toEqual("required() impl");
  });
});