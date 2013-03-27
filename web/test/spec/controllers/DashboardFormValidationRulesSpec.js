describe("DashboardFormValidationRules", function() {
  var rules, rulesBuilderConstructor, rulesBuilder, validationFn, scope;
  beforeEach(function() {
    scope = {dashboardName: "test_value"};

    validationFn = sinon.stub();
    rulesBuilder = {
      withRule: sinon.stub(),
      build: function() {return validationFn;}
    };
    rulesBuilderConstructor = sinon.stub(jashboard, "ValidationRulesBuilder");
    rulesBuilderConstructor.returns(rulesBuilder);
  });

  afterEach(function() {
    rulesBuilderConstructor.restore();
  });

  it("should validate the 'dashboardName' field with the 'required' rule", function() {
    rulesBuilder.withRule.withArgs(jashboard.CommonValidationRules.required).returns(rulesBuilder);
    validationFn.withArgs("test_value").returns("test_validation_result");

    rules = new jashboard.DashboardFormValidationRules(scope);

    expect(rules.dashboardName()).toEqual("test_validation_result");
  });
});