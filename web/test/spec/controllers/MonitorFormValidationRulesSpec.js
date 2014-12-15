describe("MonitorFormValidationRules", function() {
  var rules, scope, rulesBuilderConstructor, scopeRules, rulesBuilder, validationFn;
  beforeEach(function() {
    validationFn = sinon.stub();
    var fakeRulesBuilder = jasmine.createSpyObj("ValidationRulesBuilder", ['withRule', 'build']);
    fakeRulesBuilder.withRule.and.returnValue(fakeRulesBuilder);
    rulesBuilder = {
      withRule: sinon.stub(),
      build: function() {return validationFn;}
    };
    rulesBuilderConstructor = sinon.stub(jashboard, "ValidationRulesBuilder");
    rulesBuilderConstructor.returns(rulesBuilder);
    rulesBuilder.withRule.returns(fakeRulesBuilder);

    scope = {
      monitorFormModel: {
        name: "test_name",
        refreshInterval: "test_monitor_refresh"
      }
    };
  });

  afterEach(function() {
    rulesBuilderConstructor.restore();
  });

  it("should validate the 'monitorName' field with the 'required' rule", function() {
    var requiredRule = spyOn(jashboard.commonValidationRules, "required");
    requiredRule.and.returnValue("test_validation_result");
    rules = new jashboard.MonitorFormValidationRules(scope);

    expect(rules.monitorName()).toEqual("test_validation_result");
    expect(requiredRule).toHaveBeenCalledWith("test_name");
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