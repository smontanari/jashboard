describe("BuildMonitorFormValidationRules", function() {
  var rules, rulesBuilderConstructor, scopeRules, rulesBuilder, validationFn, scope;
  beforeEach(function() {
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

    scope = {monitorConfigurationFormModel: {build: {
      hostname: "test_hostname",
      port: "test_port",
    }}};
  });

  afterEach(function() {
    rulesBuilderConstructor.restore();
  });

  it("should validate the 'serverName' field with the 'required' rule", function() {
    var rules = new jashboard.plugin.build.BuildMonitorFormValidationRules();
    var requiredRule = spyOn(jashboard.commonValidationRules, "required");
    requiredRule.andReturn("required_validation_result");

    expect(rules.serverName(scope)).toEqual("required_validation_result");
    expect(requiredRule).toHaveBeenCalledWith("test_hostname");
  });

  it("should validate the 'serverPort' field with the 'required' and 'positiveInteger' rule", function() {
    _.each(['required', 'positiveInteger'], function(rule) {
      rulesBuilder.withRule.withArgs(jashboard.commonValidationRules[rule]).returns(rulesBuilder);  
    });
    validationFn.withArgs("test_port").returns("test_validation_result");

    rules = new jashboard.plugin.build.BuildMonitorFormValidationRules();

    expect(rules.serverPort(scope)).toEqual("test_validation_result");
  });
});