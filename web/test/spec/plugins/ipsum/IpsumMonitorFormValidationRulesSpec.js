describe("IpsumMonitorFormValidationRules", function() {
  var rules, rulesBuilderConstructor, scopeRules, rulesBuilder, validationFn, scope;
  beforeEach(function() {
    scope = {monitorConfigurationFormModel: {ipsum: {numberOfSentences: "test_number"}}};

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

  it("should validate the 'numberOfSentences' field with the 'required' and 'positiveInteger' rule", function() {
    _.each(['required', 'positiveInteger'], function(rule) {
      rulesBuilder.withRule.withArgs(jashboard.commonValidationRules[rule]).returns(rulesBuilder);  
    });
    validationFn.withArgs("test_number").returns("test_validation_result");

    rules = new jashboard.plugin.ipsum.IpsumMonitorFormValidationRules(scope);

    expect(rules.numberOfSentences(scope)).toEqual("test_validation_result");
  });
});