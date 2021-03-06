(function(module) {
  jashboard.plugin.ipsum = _.extend(module, {
    IpsumMonitorFormController: function(scope) {
      scope.availableLanguages = ['english', 'french', 'latin'];

      scope.$on("OpenMonitorDialog", function(event, options) {
        if (options.mode === jashboard.model.inputOptions.createMode) {
          scope.monitorConfigurationFormModel.ipsum = {
            language: _.first(scope.availableLanguages),
            numberOfSentences: 1
          };
        }
        scope.formHelper.registerMonitorTypeForm("ipsum", scope.ipsumMonitorForm);
      });
    }
  });
  jashboard.application.controller("IpsumMonitorFormController", ['$scope', jashboard.plugin.ipsum.IpsumMonitorFormController])
  .run(['$log', function(log) {
    log.info("IpsumMonitorFormController initialized");
  }]);
}(jashboard.plugin.ipsum || {}));
