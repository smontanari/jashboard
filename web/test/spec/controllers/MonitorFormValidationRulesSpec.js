describe("MonitorFormValidationRules", function() {
  var rules, scopeRulesContructor, scopeRules, scope;
  beforeEach(function() {
    scope = {id: "scope"};

    scopeRules = {
      required: sinon.stub(),
      number: sinon.stub()
    };
    scopeRulesContructor = sinon.stub(jashboard, "ScopeValidationRulesBuilder");
    scopeRulesContructor.withArgs(scope).returns(scopeRules);
  });

  afterEach(function() {
    scopeRulesContructor.restore();
  });

  it("should validate the 'monitorName' field with the 'required' rule", function() {
    var validationFn = function() {return "test_validation_result"; };
    scopeRules.required.withArgs("monitorName").returns(validationFn);

    rules = new jashboard.MonitorFormValidationRules(scope);

    expect(rules.monitorName()).toEqual("test_validation_result");
  });

  describe("'monitorRefresh field validation", function() {
    beforeEach(function() {
      var validationFn = function() {return "test_validation_result"; };
      scopeRules.number.withArgs("monitorRefresh").returns(validationFn);

      rules = new jashboard.MonitorFormValidationRules(scope);

    });
    it("should validate with the 'number' rule", function() {
      expect(rules.monitorRefresh()).toEqual("test_validation_result");
    });
  });
});