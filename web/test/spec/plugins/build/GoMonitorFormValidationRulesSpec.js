describe("GoMonitorFormValidationRules", function() {
  var rules, scope, requiredRule;
  beforeEach(function() {
    scope = {monitorConfigurationFormModel: {build: {}}};

    scope = {monitorConfigurationFormModel: {build: {
      pipeline: "test_pipeline",
      stage: "test_stage",
      job: "test_job"
    }}};

    requiredRule = spyOn(jashboard.commonValidationRules, "required");
    requiredRule.and.returnValue("required_validation_result");

    rules = new jashboard.plugin.build.GoMonitorFormValidationRules(scope);
  });

  _.each(['pipeline', 'stage'], function(field) {
    it("should validate the '" + field + "' field with the 'required' rule when monitor type is 'go'", function() {
      var inputName = "go" + jashboard.stringUtils.capitalise(field);
      scope.monitorConfigurationFormModel.build.type = 'go';

      expect(rules[inputName]()).toEqual("required_validation_result");
      expect(requiredRule).toHaveBeenCalledWith("test_" + field);
    });
    it("should not apply any rule to field '" + field + "' when monitor type is not 'go'", function() {
      var inputName = "go" + jashboard.stringUtils.capitalise(field);
      scope.monitorConfigurationFormModel.build.type = 'another_type';

      expect(rules[inputName]()).toBeUndefined();
    });
  });
});