(function(module) {
  jashboard.plugin.vcs = _.extend(module, {
    VcsMonitorFormController: function(scope) {
      scope.availableVcsTypes = ["git"];

      scope.toggleSlideShowEffect = function() {
        if (!scope.monitorConfigurationFormModel.vcs.pagination) {
          scope.monitorConfigurationFormModel.vcs.commitsPerPage = null;
        }
      };

      scope.$on("OpenMonitorDialog", function(event, options) {
        if (options.mode === jashboard.inputOptions.createMode) {
          scope.monitorConfigurationFormModel.vcs = {
            type: _.first(scope.availableVcsTypes),
            historyLength: 1,
            branch: null,
            pagination: false,
            commitsPerPage: null
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
