(function(module) {
  jashboard = _.extend(module, {
    MonitorFormController: function(scope, repository, pluginManager, monitorLayoutManager) {
      scope.availableMonitorTypes = pluginManager.getAllMonitorTypes();
      scope.inputMonitor = {};
      var formValidator = new jashboard.FormValidator(new jashboard.MonitorFormValidationRules(scope));
      var parseRefreshInterval = function(inputValue) {
        var value = parseInt(inputValue, 10);
        if (_.isFinite(value)) {
          return value;
        }
        return 0;
      };
      var saveMonitorCallback = function() {
        var dashboard = _.find(scope.dashboards, function(dashboard) {
          return (dashboard.id === scope.inputMonitor.dashboard_id);
        });
        var monitorType = scope.inputMonitor.type;
        var monitorAdapter = pluginManager.findMonitorAdapter(monitorType);
        var monitorParameters = {
          name: scope.inputMonitor.name,
          refreshInterval: parseRefreshInterval(scope.inputMonitor.refreshInterval),
          type: scope.inputMonitor.type,
          size: monitorAdapter.defaultSize(),
          position: monitorLayoutManager.nextAvailableMonitorPosition(dashboard, monitorAdapter.defaultSize()),
          configuration: monitorAdapter.validateConfiguration(scope.inputMonitor.configuration[monitorType])
        };
        scope.$emit("MonitorCreateStart");
        repository.createMonitor(scope.inputMonitor.dashboard_id, monitorParameters, {
          success: function(monitor) {
            dashboard.monitors.push(monitor);
            scope.$apply();
            scope.$emit("MonitorCreateComplete");
          },
          error: function() {
            scope.$emit("AjaxError");
          }
        });
        scope.$emit("CloseMonitorDialog");
      };

      scope.$on("OpenMonitorDialog", function(event, dashboard_id) {
        formValidator.initForm(scope.monitorForm);
        scope.monitorFormValidator = formValidator;
        scope.inputMonitor = {dashboard_id: dashboard_id, configuration: {}};
        scope.workflow = new jashboard.CreateMonitorWorkflow(saveMonitorCallback);
      });
    }
  });
  jashboard.application.controller("MonitorFormController", ['$scope', 'Repository', 'PluginManager', 'MonitorLayoutManager', jashboard.MonitorFormController]).run(function() {
    steal.dev.log("MonitorFormController initialized");
  });
}(jashboard || {}));
