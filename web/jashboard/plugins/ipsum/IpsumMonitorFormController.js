(function(module) {
  jashboard.plugin.ipsum = _.extend(module, {
    IpsumMonitorFormController: function(scope) {
      var languages = ['english', 'french', 'latin'];
      scope.availableLanguages = languages;
      var validationRules = new jashboard.IpsumMonitorFormValidationRules(scope);
      scope.ipsumMonitorFormValidator = new jashboard.FormValidator();

      scope.$on("OpenMonitorDialog", function(event, options) {
        if (options.mode === jashboard.inputOptions.createMode) {
          scope.monitorConfigurationFormModel.ipsum = {
            language: _.first(languages)
          };
          scope.ipsumMonitorFormValidator.prepareFormForCreate(scope.ipsumMonitorForm, validationRules);
        } else if (options.parameters.monitor.type === 'ipsum'){
          scope.monitorConfigurationFormModel.ipsum = options.parameters.monitor.configuration;
          scope.ipsumMonitorFormValidator.prepareFormForUpdate(scope.ipsumMonitorForm, validationRules);
        }
        scope.formHelper.registerMonitorTypeForm("ipsum", scope.ipsumMonitorForm);
      });
    }
  });
  jashboard.application.controller("IpsumMonitorFormController", ['$scope', jashboard.plugin.ipsum.IpsumMonitorFormController])
    .run(function() {
      steal.dev.log("IpsumMonitorFormController initialized");
  });
}(jashboard.plugin.ipsum || {}));
