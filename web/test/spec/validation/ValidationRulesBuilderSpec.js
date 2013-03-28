describe("ValidationRulesBuilder", function() {
  it("should trim the input value", function() {
    var rule = sinon.stub()
    rule.withArgs("test value").returns({rule: "test-rule"});

    var validation = new jashboard.ValidationRulesBuilder().withRule(rule).build();
    var result = validation(" test value ");

    expect(result).toEqual({rule: "test-rule"});
  });
  it("should build a validation function with one rule", function() {
    var rule = sinon.stub()
    rule.withArgs("test-value").returns({rule: "test-rule"});

    var validation = new jashboard.ValidationRulesBuilder().withRule(rule).build();
    var result = validation("test-value");

    expect(result).toEqual({rule: "test-rule"});
  });
  it("should build a validation function with multiple rules", function() {
    var rule1 = sinon.stub();
    var rule2 = sinon.stub();
    var rule3 = sinon.stub();

    rule1.withArgs("test-value").returns({rule1: true});
    rule3.withArgs("test-value").returns({rule3: true});

    var validation = new jashboard.ValidationRulesBuilder()
      .withRule(rule1)
      .withRule(rule2)
      .withRule(rule3)
      .build();

    var result = validation("test-value");

    expect(result).toEqual({rule1: true, rule3: true});
  });
});