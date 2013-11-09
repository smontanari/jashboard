(function(module) {
  jashboard.angular = _.extend(module, {
    formValidationDirective: function () {
      var createValidationRules = function(rulesName, scope) {
        var rulesFn = _.reduce(rulesName.split("."), function(module, name) {
          return module[name];
        }, jashboard);
        var RulesDefinition = rulesFn.bind();
        return new RulesDefinition(scope);
      };
      return function(scope, element, attrs) {
        var attributes = scope.$eval(attrs.jbFormValidation);
        var validationRules = createValidationRules(attributes.validationRules, scope);
        if (attrs.ngForm) {
          var form = scope[attrs.ngForm];
          scope.$formValidator = new jashboard.FormValidator(form, scope);

          scope.validateFields = function() {
            scope.$formValidator.validate(_.toArray(arguments));
          };
          scope.inputInError = function(inputName) {
            if (_.isObject(form[inputName])) {
              return !_.isEmpty(form[inputName].$error);
            }
          };
        }
        if (attributes.triggerOnEvent) {
          scope.$on(attributes.triggerOnEvent, function(event) {
            scope.$formValidator.applyRules(validationRules);
          });
        }
        if (attributes.triggerOnLoad !== false) {
          scope.$formValidator.applyRules(validationRules);
        }
      };
    }
  });
  jashboard.application.directive("jbFormValidation", [jashboard.angular.formValidationDirective])
  .run(['$log', function(log) {
    log.info("formValidationDirective initialized");
  }]);
}(jashboard.angular || {}));
