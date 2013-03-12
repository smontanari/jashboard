(function(module) {
  jashboard = _.extend(module, {
    MonitorFormController: function(scope, repository, pluginManager) {
      scope.availableMonitorTypes = pluginManager.getAllMonitorTypes();

      scope.$on("OpenMonitorDialog", function(event, dashboard_id) {
        scope.monitorForm = {dashboard_id: dashboard_id, configuration: {}};
        scope.workflow = new jashboard.CreateMonitorWorkflow(scope, repository, pluginManager);
      });
    }
  });
  jashboard.application.controller("MonitorFormController", ['$scope', 'Repository', 'PluginManager', jashboard.MonitorFormController]).run(function() {
    steal.dev.log("MonitorFormController initialized");
  });
}(jashboard || {}));
