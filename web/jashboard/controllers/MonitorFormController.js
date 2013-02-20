(function(module) {
  jashboard = _.extend(module, {
    MonitorFormController: function(scope, repository) {
      scope.$on("OpenMonitorDialog", function(event, dashboard_id) {
        scope.monitorForm = {dashboard_id: dashboard_id};
        scope.workflow = new jashboard.CreateMonitorWorkflow(scope, repository);
      });
    }
  });
  jashboard.application.controller("MonitorFormController", ['$scope', 'Repository', jashboard.MonitorFormController]).run(function() {
    steal.dev.log("MonitorFormController initialized");
  });
}(jashboard || {}));
