jashboard.MonitorFormController = function(scope, repository) {
  var monitorFormSelector = "#new-monitor-form";

  scope.$on("NewMonitorCreated", function(event) {
    $(monitorFormSelector).modal('hide');
  });

  scope.$on("OpenMonitorDialog", function(event, dashboard_id) {
    scope.monitorForm = {dashboard_id: dashboard_id};
    scope.workflow = new jashboard.CreateMonitorWorkflow(scope, repository);
    $(monitorFormSelector).modal('show');
  });
};

jashboard.application.controller("MonitorFormController", ['$scope', 'Repository', jashboard.MonitorFormController]).run(function() {
  steal.dev.log("MonitorFormController initialized");
});


