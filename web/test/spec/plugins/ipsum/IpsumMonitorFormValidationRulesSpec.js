describe("IpsumMonitorFormValidationRules", function() {
  var rules, rulesBuilderConstructor, scopeRules, rulesBuilder, validationFn, scope;
  beforeEach(function() {
    scope = {monitorConfigurationFormModel: {ipsum: {numberOfSentences: "test_number"}}};

    validationFn = sinon.stub();
    var fakeRulesBuilder = jasmine.createSpyObj("ValidationRulesBuilder", ['withRule', 'build']);
    fakeRulesBuilder.withRule.andReturn(fakeRulesBuilder);
    rulesBuilder = {
      withRule: sinon.stub(),
      build: function() {return validationFn;}
    };
    rulesBuilderConstructor = sinon.stub(jashboard, "ValidationRulesBuilder");
    rulesBuilderConstructor.returns(rulesBuilder);
    rulesBuilder.withRule.returns(fakeRulesBuilder);
  });

  afterEach(function() {
    rulesBuilderConstructor.restore();
  });

  it("should not validate the fields if the monitorConfigurationFormModel of type 'ipsum' is not defined", function() {
    scope.monitorConfigurationFormModel.ipsum = undefined;
    
    rules = new jashboard.plugin.ipsum.IpsumMonitorFormValidationRules();
    
    expect(rules.ipsumNumberOfSentences(scope)).toBeUndefined();
  });

  it("should validate the 'numberOfSentences' field with the 'required' and 'positiveInteger' rule", function() {
    _.each(['required', 'positiveInteger'], function(rule) {
      rulesBuilder.withRule.withArgs(jashboard.commonValidationRules[rule]).returns(rulesBuilder);  
    });
    validationFn.withArgs("test_number").returns("test_validation_result");

    rules = new jashboard.plugin.ipsum.IpsumMonitorFormValidationRules();

    expect(rules.ipsumNumberOfSentences(scope)).toEqual("test_validation_result");
  });
});