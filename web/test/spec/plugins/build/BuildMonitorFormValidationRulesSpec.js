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

    rules = new jashboard.plugin.build.BuildMonitorFormValidationRules();
  });

  afterEach(function() {
    rulesBuilderConstructor.restore();
  });

  it("should not validate the fields if the monitorConfigurationFormModel of type 'build' is not defined", function() {
    scope.monitorConfigurationFormModel.build = undefined;

    _.each(['buildServerName', 'buildServerPort'], function(field) {
      expect(rules[field](scope)).toBeUndefined();
    });
  });

  it("should validate the 'buildServerName' field with the 'required' rule", function() {
    var requiredRule = spyOn(jashboard.commonValidationRules, "required");
    requiredRule.andReturn("required_validation_result");

    expect(rules.buildServerName(scope)).toEqual("required_validation_result");
    expect(requiredRule).toHaveBeenCalledWith("test_hostname");
  });

  it("should validate the 'buildServerPort' field with the 'required' and 'positiveInteger' rule", function() {
    _.each(['required', 'positiveInteger'], function(rule) {
      rulesBuilder.withRule.withArgs(jashboard.commonValidationRules[rule]).returns(rulesBuilder);  
    });
    validationFn.withArgs("test_port").returns("test_validation_result");

    rules = new jashboard.plugin.build.BuildMonitorFormValidationRules();

    expect(rules.buildServerPort(scope)).toEqual("test_validation_result");
  });
});