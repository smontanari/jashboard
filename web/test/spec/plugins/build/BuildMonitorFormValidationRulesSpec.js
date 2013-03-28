describe("BuildMonitorFormValidationRules", function() {
  var rules, rulesBuilderConstructor, scopeRules, rulesBuilder, validationFn, scope;
  beforeEach(function() {
    scope = {inputMonitor: {configuration: {
      build: {
        hostname: "test_server_name",
        port: "1234"
      }
    }}};

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

  it("should validate the 'serverName' field with the 'required' rule", function() {
    rulesBuilder.withRule.withArgs(jashboard.commonValidationRules.required).returns(rulesBuilder);
    validationFn.withArgs("test_server_name").returns("test_validation_result");

    rules = new jashboard.BuildMonitorFormValidationRules(scope);

    expect(rules.serverName()).toEqual("test_validation_result");
  });

  it("should validate the 'serverPort' field with the 'required' and 'positiveInteger' rule", function() {
    _.each(['required', 'positiveInteger'], function(rule) {
      rulesBuilder.withRule.withArgs(jashboard.commonValidationRules[rule]).returns(rulesBuilder);  
    });
    validationFn.withArgs("1234").returns("test_validation_result");

    rules = new jashboard.BuildMonitorFormValidationRules(scope);

    expect(rules.serverPort()).toEqual("test_validation_result");
  });
});