describe("VcsMonitorFormValidationRules", function() {
  var rules, rulesBuilderConstructor, scopeRules, rulesBuilder, validationFn, requiredRule, scope;
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

    requiredRule = spyOn(jashboard.commonValidationRules, "required");
    requiredRule.andReturn("required_validation_result");

    scope = {monitorConfigurationFormModel: {vcs: {
      workingDirectory: "test_directory",
      branch: "test_branch",
      historyLength: "test_length"
    }}};

    rules = new jashboard.plugin.vcs.VcsMonitorFormValidationRules();
  });

  afterEach(function() {
    rulesBuilderConstructor.restore();
  });

  it("should not validate the fields if the monitorConfigurationFormModel of type 'vcs' is not defined", function() {
    scope.monitorConfigurationFormModel.vcs = undefined;

    _.each(['vcsWorkingDir', 'vcsHistoryLength'], function(field) {
      expect(rules[field](scope)).toBeUndefined();
    });
  });
  it("should validate the 'vcsWorkingDir' field with the 'required' rule", function() {
    expect(rules.vcsWorkingDir(scope)).toEqual("required_validation_result");
    expect(requiredRule).toHaveBeenCalledWith("test_directory");
  });
  it("should validate the 'vcsHistoryLength' field with the 'required' and 'positiveInteger' rule", function() {
    _.each(['required', 'positiveInteger'], function(rule) {
      rulesBuilder.withRule.withArgs(jashboard.commonValidationRules[rule]).returns(rulesBuilder);  
    });
    validationFn.withArgs("test_length").returns("test_validation_result");
    
    rules = new jashboard.plugin.vcs.VcsMonitorFormValidationRules();

    expect(rules.vcsHistoryLength(scope)).toEqual("test_validation_result");
  });
  it("should validate the 'vcsPageSize' field with the 'required' and 'positiveInteger' rule when the vcsPageSlideShow field is true", function() {
    scope.monitorConfigurationFormModel.vcs.pagination = true,
    scope.monitorConfigurationFormModel.vcs.commitsPerPage = "test_page_size";

    _.each(['required', 'positiveInteger'], function(rule) {
      rulesBuilder.withRule.withArgs(jashboard.commonValidationRules[rule]).returns(rulesBuilder);  
    });
    validationFn.withArgs("test_page_size").returns("test_validation_result");
    
    rules = new jashboard.plugin.vcs.VcsMonitorFormValidationRules();

    expect(rules.vcsPageSize(scope)).toEqual("test_validation_result");
  });
  it("should not validate the 'vcsPageSize' field when the vcsPageSlideShow field is false, null or undefined", function() {
    scope.monitorConfigurationFormModel.vcs.commitsPerPage = "test_page_size";
    _.each([false, null, undefined], function (value) {
      scope.monitorConfigurationFormModel.vcs.pagination = value;
      
      expect(rules.vcsPageSize(scope)).toBeUndefined();
    });
  });
});