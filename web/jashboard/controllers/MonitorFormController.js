(function(module) {
  jashboard = _.extend(module, {
    MonitorFormController: function(scope, repository, pluginManager, monitorLayoutManager) {
      var parseRefreshInterval = function(inputValue) {
        if (_.isFinite(inputValue)) {
          return parseInt(inputValue, 10);
        }
        return 0;
      };
      var saveMonitor = function() {
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
          configuration: monitorAdapter.getMonitorConfiguration(scope.inputMonitor.configuration[monitorType])
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

      scope.availableMonitorTypes = pluginManager.getAllMonitorTypes();
      scope.monitorFormValidator = new jashboard.FormValidator(new jashboard.MonitorFormValidationRules(scope));

      scope.$on("NewMonitorDialog", function(event, dashboard_id) {
        scope.inputMonitor = {
          dashboard_id: dashboard_id,
          type: _.first(scope.availableMonitorTypes),
          configuration: {}
        };
        scope.monitorFormValidator.initForm(scope.baseMonitorForm);
        scope.formHelper = new jashboard.CreateMonitorFormHelper(scope.baseMonitorForm, scope.inputMonitor, saveMonitor);
      });
      // scope.$on("EditMonitorDialog", function(event, monitor) {
      //   scope.inputMonitor = monitor;
      //   scope.monitorFormValidator.initForm(scope.baseMonitorForm);
      //   scope.formHelper = new jashboard.CreateMonitorFormHelper(scope.baseMonitorForm, scope.inputMonitor, saveMonitor);
      // });
    }
  });
  jashboard.application.controller("MonitorFormController", ['$scope', 'Repository', 'PluginManager', 'MonitorLayoutManager', jashboard.MonitorFormController]).run(function() {
    steal.dev.log("MonitorFormController initialized");
  });
}(jashboard || {}));
