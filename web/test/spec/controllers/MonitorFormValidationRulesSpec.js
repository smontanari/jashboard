describe("MonitorFormValidationRules", function() {
  var rules, rulesBuilderConstructor, scopeRules, rulesBuilder, validationFn, scope;
  beforeEach(function() {
    scope = {
      monitorName: "test_monitor_name",
      monitorRefresh: "test_monitor_refresh"
    };

    validationFn = sinon.stub();
    rulesBuilder = jasmine.createSpyObj("ValidationRulesBuilder", ['withRule', 'build']);
    rulesBuilderConstructor = sinon.stub(jashboard, "ValidationRulesBuilder");
    rulesBuilderConstructor.returns(rulesBuilder);
    rulesBuilder.withRule.andReturn(rulesBuilder);
    rulesBuilder.build.andReturn(validationFn);    
  });

  afterEach(function() {
    rulesBuilderConstructor.restore();
  });

  it("should validate the 'monitorName' field with the 'required' rule", function() {
    validationFn.withArgs("test_monitor_name").returns("test_validation_result");

    rules = new jashboard.MonitorFormValidationRules(scope);

    expect(rules.monitorName()).toEqual("test_validation_result");
    expect(rulesBuilder.withRule).toHaveBeenCalledWith("required");
  });

  describe("'monitorRefresh' field validation", function() {
    beforeEach(function() {
      validationFn.withArgs("test_monitor_refresh").returns("test_validation_result");

      rules = new jashboard.MonitorFormValidationRules(scope);
    });
    it("should validate with the 'number' rule", function() {
      expect(rules.monitorRefresh()).toEqual("test_validation_result");
      expect(rulesBuilder.withRule).toHaveBeenCalledWith("number");
    });
  });
});