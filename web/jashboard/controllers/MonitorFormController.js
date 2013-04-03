(function(module) {
  jashboard = _.extend(module, {
    MonitorFormController: function(scope, repository, pluginManager, monitorLayoutManager) {
      var saveMonitor = function() {
        var dashboard = _.find(scope.dashboards, function(dashboard) {
          return (dashboard.id === scope.dashboard_id);
        });
        var monitorType = scope.inputMonitor.type;
        var monitorAdapter = pluginManager.findMonitorAdapter(monitorType);
        var monitorParameters = {
          name: scope.inputMonitor.name,
          refreshInterval: parseInt(scope.inputMonitor.refreshInterval, 10),
          type: scope.inputMonitor.type,
          size: monitorAdapter.defaultSize(),
          position: monitorLayoutManager.nextAvailableMonitorPosition(dashboard, monitorAdapter.defaultSize()),
          configuration: monitorAdapter.getMonitorConfiguration(scope.inputMonitor.configuration[monitorType])
        };
        scope.$emit("MonitorCreateStart");
        repository.createMonitor(scope.dashboard_id, monitorParameters, {
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

      scope.$on("OpenMonitorDialog", function(event, options) {
        if (options.mode === jashboard.inputOptions.createMode) {
          scope.dashboard_id = options.parameters.dashboard_id;
          scope.inputMonitor = {
            id: null,
            type: _.first(scope.availableMonitorTypes),
            configuration: {}
          };
          scope.monitorFormValidator.prepareForm(scope.baseMonitorForm, true);
        } else {
          scope.inputMonitor = _.pick(options.parameters.monitor, "id", "name", "type", "refreshInterval", "configuration");
          scope.dashboard_id = null;
          scope.monitorFormValidator.prepareForm(scope.baseMonitorForm, false);
        }
        scope.editMode = options.mode;
        scope.formHelper = new jashboard.CreateMonitorFormHelper(scope.baseMonitorForm, scope.inputMonitor, saveMonitor);
      });
    }
  });
  jashboard.application.controller("MonitorFormController", ['$scope', 'Repository', 'PluginManager', 'MonitorLayoutManager', jashboard.MonitorFormController]).run(function() {
    steal.dev.log("MonitorFormController initialized");
  });
}(jashboard || {}));
