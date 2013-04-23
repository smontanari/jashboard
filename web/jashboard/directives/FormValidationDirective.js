(function(module) {
  jashboard.angular = _.extend(module, {
    formValidationDirective: function () {
      var createValidationRules = function(rulesName) {
        var rulesFn = _.reduce(rulesName.split("."), function(module, name) {
          return module[name];
        }, jashboard);
        var RulesDefinition = rulesFn.bind();
        return new RulesDefinition();
      };
      return function(scope, element, attrs) {
        var attributes = scope.$eval(attrs.jbFormValidation);
        var validationRules = createValidationRules(attributes.validationRules);
        if (attrs.ngForm) {
          var form = scope[attrs.ngForm];
          scope.$formValidator = new jashboard.FormValidator(form, scope);

          scope.validateField = function(inputName) {
            scope.$formValidator.validate(inputName);
          };
          scope.inputInError = function(inputName) {
            if (_.isObject(form[inputName])) {
              return form[inputName].$dirty && !_.isEmpty(form[inputName].$error);
            }
          };
        }
        if (attributes.triggerOnEvent) {
          scope.$on(attributes.triggerOnEvent, function(event) {
            scope.$formValidator.applyRules(validationRules);
          });
        }
        if (_.isUndefined(attributes.triggerOnLoad) || attributes.triggerOnLoad === true) {
          scope.$formValidator.applyRules(validationRules);
        }
      };
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbFormValidation", [jashboard.angular.formValidationDirective]).run(function($log) {
  $log.info("formValidationDirective initialized");
});