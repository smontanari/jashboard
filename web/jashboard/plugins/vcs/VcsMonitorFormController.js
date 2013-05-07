(function(module) {
  jashboard.plugin.vcs = _.extend(module, {
    VcsMonitorFormController: function(scope) {
      scope.availableVcsTypes = ["git"];

      scope.toggleSlideShowEffect = function() {
        if (!scope.monitorConfigurationFormModel.vcs.pagination) {
          scope.monitorConfigurationFormModel.vcs.commitsPerPage = 1;
          scope.monitorConfigurationFormModel.vcs.interval = 5;
        }
      };

      scope.$on("OpenMonitorDialog", function(event, options) {
        if (options.mode === jashboard.model.inputOptions.createMode) {
          scope.monitorConfigurationFormModel.vcs = {
            type: _.first(scope.availableVcsTypes),
            historyLength: 1,
            branch: null,
            pagination: false,
            commitsPerPage: 1,
            interval: 5
          };
        }
        scope.formHelper.registerMonitorTypeForm("vcs", scope.vcsMonitorForm);
      });
    }
  });
  jashboard.application.controller("VcsMonitorFormController", ['$scope', jashboard.plugin.vcs.VcsMonitorFormController])
    .run(function($log) {
      $log.info("VcsMonitorFormController initialized");
  });
}(jashboard.plugin.vcs || {}));
