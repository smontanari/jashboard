(function(module) {
  jashboard.plugin.ipsum = _.extend(module, {
    IpsumMonitorFormController: function(scope) {
      var languages = ['english', 'french', 'latin'];
      scope.availableLanguages = languages;

      scope.$on("OpenMonitorDialog", function(event, options) {
        if (options.mode === jashboard.inputOptions.createMode) {
          scope.monitorConfigurationFormModel.ipsum = {
            language: _.first(languages)
          };
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
