describe("JenkinsMonitorFormValidationRules", function() {
  var rules, scope, requiredRule;

  beforeEach(function() {
    scope = {monitorConfigurationFormModel: {build: {build_id: "test_build_id"}}};

    requiredRule = spyOn(jashboard.commonValidationRules, "required");
    requiredRule.andReturn("required_validation_result");

    rules = new jashboard.plugin.build.JenkinsMonitorFormValidationRules();
  });

  it("should apply the 'required' rule to field 'build_id' when monitor type is 'jenkins'", function() {
    scope.monitorConfigurationFormModel.build.type = 'jenkins';

    expect(rules.jenkins_build_id(scope)).toEqual("required_validation_result");
    expect(requiredRule).toHaveBeenCalledWith("test_build_id");
  });
  it("should not apply any rule to field 'build_id' when monitor type is not 'jenkins'", function() {
    scope.monitorConfigurationFormModel.build.type = 'another_type';

    expect(rules.jenkins_build_id(scope)).toBeUndefined();
  });
});