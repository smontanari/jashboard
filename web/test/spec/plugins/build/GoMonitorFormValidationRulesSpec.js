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
    requiredRule.andReturn("required_validation_result");

    rules = new jashboard.plugin.build.GoMonitorFormValidationRules(scope);
  });

  _.each(['pipeline', 'stage', 'job'], function(field) {
    var inputName = "go_" + field;
    it("should validate the '" + inputName + "' field with the 'required' rule when monitor type is 'go'", function() {
      scope.monitorConfigurationFormModel.build.type = 'go';

      expect(rules[inputName](scope)).toEqual("required_validation_result");
      expect(requiredRule).toHaveBeenCalledWith("test_" + field);
    });
    it("should not apply any rule to field '" + field + "' when monitor type is not 'jenkins'", function() {
      scope.monitorConfigurationFormModel.build.type = 'another_type';

      expect(rules[inputName](scope)).toBeUndefined();
    });
  });
});