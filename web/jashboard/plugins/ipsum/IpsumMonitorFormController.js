(function(module) {
  jashboard.plugin.ipsum = _.extend(module, {
    IpsumMonitorFormController: function(scope) {
      var languages = ['english', 'french', 'latin'];
      scope.availableLanguages = languages;
      scope.ipsumMonitorFormValidator = new jashboard.FormValidator(new jashboard.IpsumMonitorFormValidationRules(scope));

      scope.$on("OpenMonitorDialog", function(event, options) {
        if (options.mode === jashboard.inputOptions.createMode) {
          scope.monitorConfigurationData.ipsum = {
            language: _.first(languages)
          };
          scope.ipsumMonitorFormValidator.prepareForm(scope.ipsumMonitorForm, true);
        } else if (options.parameters.monitor.type === 'ipsum'){
          scope.monitorConfigurationData.ipsum = options.parameters.monitor.configuration;
          scope.ipsumMonitorFormValidator.prepareForm(scope.ipsumMonitorForm, false);
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
