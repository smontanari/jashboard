describe("DashboardFormValidationRules", function() {
  it("should validate the 'dashboardName' field with the 'required' rule", function() {
    var requiredRule = spyOn(jashboard.commonValidationRules, "required");
    requiredRule.andReturn("test-result");
    var scope = {dashboardFormModel: {name: "test-name"}};
    
    var rules = new jashboard.DashboardFormValidationRules();

    expect(rules.dashboardName(scope)).toEqual("test-result");
    expect(requiredRule).toHaveBeenCalledWith("test-name");
  });
});