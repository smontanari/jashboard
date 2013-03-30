(function(module) {
  jashboard.plugin.ipsum = _.extend(module, {
    IpsumMonitorFormController: function(scope) {
      var languages = ['english', 'french', 'latin'];
      scope.availableLanguages = languages;
      scope.ipsumMonitorFormValidator = new jashboard.FormValidator(new jashboard.IpsumMonitorFormValidationRules(scope));

      scope.$on("OpenMonitorDialog", function(event) {
        scope.inputMonitor.configuration.ipsum = {
          language: _.first(languages)
        };
        scope.ipsumMonitorFormValidator.initForm(scope.ipsumMonitorForm);
        scope.workflow.registerMonitorTypeForm("ipsum", scope.ipsumMonitorForm);
      });
    }
  });
  jashboard.application.controller("IpsumMonitorFormController", ['$scope', jashboard.plugin.ipsum.IpsumMonitorFormController])
    .run(function() {
      steal.dev.log("IpsumMonitorFormController initialized");
  });
}(jashboard.plugin.ipsum || {}));
