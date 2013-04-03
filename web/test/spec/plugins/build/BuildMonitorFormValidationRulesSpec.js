describe("BuildMonitorFormValidationRules", function() {
  var rules, rulesBuilderConstructor, scopeRules, rulesBuilder, validationFn, scope;
  var verifyValidationPerformed = function(inputName, inputValue, rules) {
    var rulesWithQuotes = _.map(rules, function(rule) {
      return "'" + rule + "'";
    });
    var rulesDescription = _.first(rulesWithQuotes);
    if (rulesWithQuotes.length > 1) {
      rulesDescription = rulesWithQuotes.join(" and ");
    }
    it("should validate the '" + inputName + "' field with the " + rulesDescription + " rule", function() {
      if (rules.length > 1) {
        _.each(rules, function(rule) {
          rulesBuilder.withRule.withArgs(jashboard.commonValidationRules[rule]).returns(rulesBuilder);  
        });
        validationFn.withArgs(inputValue).returns("test_validation_result");
      } else {
        var rule = _.first(rules);
        jashboard.commonValidationRules[rule] = sinon.stub();
        jashboard.commonValidationRules[rule].withArgs(inputValue).returns("test_validation_result");
      }

      rules = new jashboard.BuildMonitorFormValidationRules(scope);

      expect(rules[inputName]()).toEqual("test_validation_result");
    });
  };
  var verifyNoValidationPerformed = function(inputName) {
    it("should apply the 'noValidation' rule to field '" + inputName + "'", function() {
      jashboard.commonValidationRules.noValidation.returns("test_validation_result");

      rules = new jashboard.BuildMonitorFormValidationRules(scope);

      expect(rules[inputName]()).toEqual("test_validation_result");
    });
  };

  beforeEach(function() {
    scope = {monitorConfigurationFormModel: {
      build: {
        hostname: "test_server_name",
        port: "1234",
        build_id: "test_build_id",
        pipeline: "test_pipeline",
        stage: "test_stage",
        job: "test_job"
      }
    }};

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
    jashboard.commonValidationRules.required = sinon.stub();
    jashboard.commonValidationRules.noValidation = sinon.stub();
  });

  afterEach(function() {
    rulesBuilderConstructor.restore();
  });

  verifyValidationPerformed("serverName", "test_server_name", ["required"]);
  verifyValidationPerformed("serverPort", "1234", ["required", "positiveInteger"]);

  describe("Jenkins build monitor validation when monitor type is 'jenkins'", function() {
    beforeEach(function() {
      scope.monitorConfigurationFormModel.build.type = 'jenkins';
    });
    verifyValidationPerformed("jenkins_build_id", "test_build_id", ["required"]);
  });
  describe("Jenkins build monitor validation when monitor type is not 'jenkins'", function() {
    beforeEach(function() {
      scope.monitorConfigurationFormModel.build.type = 'another_type';
    });
    verifyNoValidationPerformed("jenkins_build_id");
  });
  describe("Go build monitor validation when monitor type is 'go'", function() {
    beforeEach(function() {
      scope.monitorConfigurationFormModel.build.type = 'go';
    });
    verifyValidationPerformed("go_pipeline", "test_pipeline", ["required"]);
    verifyValidationPerformed("go_stage", "test_stage", ["required"]);
    verifyValidationPerformed("go_job", "test_job", ["required"]);
  });
  describe("Go build monitor validation when monitor type is not 'go'", function() {
    beforeEach(function() {
      scope.monitorConfigurationFormModel.build.type = 'another_type';
    });
    verifyNoValidationPerformed("go_pipeline");
    verifyNoValidationPerformed("go_stage");
    verifyNoValidationPerformed("go_job");
  });
});