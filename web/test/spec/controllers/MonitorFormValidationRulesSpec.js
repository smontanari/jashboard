describe("MonitorFormValidationRules", function() {
  var rules, rulesBuilderConstructor, scopeRules, rulesBuilder, validationFn, scope;
  beforeEach(function() {
    scope = {
      baseMonitorData: {
        name: "test_monitor_name",
        refreshInterval: "test_monitor_refresh"
      }
    };

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

  it("should validate the 'monitorName' field with the 'required' rule", function() {
    rulesBuilder.withRule.withArgs(jashboard.commonValidationRules.required).returns(rulesBuilder);
    validationFn.withArgs("test_monitor_name").returns("test_validation_result");

    rules = new jashboard.MonitorFormValidationRules(scope);

    expect(rules.monitorName()).toEqual("test_validation_result");
  });

  it("should validate the 'monitorRefresh' field with the 'number' and 'positiveNumber' rule", function() {
    _.each(['number', 'positiveNumber'], function(rule) {
      rulesBuilder.withRule.withArgs(jashboard.commonValidationRules[rule]).returns(rulesBuilder);  
    });
    validationFn.withArgs("test_monitor_refresh").returns("test_validation_result");

    rules = new jashboard.MonitorFormValidationRules(scope);

    expect(rules.monitorRefresh()).toEqual("test_validation_result");
  });
});