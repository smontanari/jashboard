(function(module) {
  jashboard = _.extend(module, {
    MonitorFormController: function(scope, repository, pluginManager, monitorLayoutManager) {
      var createMonitor = function(dashboard, monitorParameters) {
        scope.$emit("MonitorSaveStart");
        repository.createMonitor(dashboard.id, monitorParameters, {
          success: function(monitor) {
            dashboard.monitors.push(monitor);
            scope.$apply();
            scope.$emit("MonitorSaveComplete");
          },
          error: function() {
            scope.$emit("AjaxError");
          }
        });
        scope.$emit("CloseMonitorDialog");
      };
      var saveMonitor = function(dashboard) {
        var monitorType = scope.baseMonitorData.type;
        var monitorAdapter = pluginManager.findMonitorAdapter(monitorType);
        var monitorParameters = {
          name: scope.baseMonitorData.name,
          refreshInterval: parseInt(scope.baseMonitorData.refreshInterval, 10),
          type: scope.baseMonitorData.type,
          size: monitorAdapter.defaultSize(),
          position: monitorLayoutManager.nextAvailableMonitorPosition(dashboard, monitorAdapter.defaultSize()),
          configuration: monitorAdapter.getMonitorConfiguration(scope.monitorConfigurationData[monitorType])
        };
        createMonitor(dashboard, monitorParameters);
      };

      scope.availableMonitorTypes = pluginManager.getAllMonitorTypes();
      scope.monitorConfigurationData = {};
      scope.monitorFormValidator = new jashboard.FormValidator(new jashboard.MonitorFormValidationRules(scope));

      scope.$on("OpenMonitorDialog", function(event, options) {
        if (options.mode === jashboard.inputOptions.createMode) {
          scope.dashboard_id = options.parameters.dashboard.id;
          scope.baseMonitorData = {
            id: null,
            name: null,
            refreshInterval: null,
            type: _.first(scope.availableMonitorTypes)
          };
          _.each(scope.availableMonitorTypes, function(type) {
            scope.monitorConfigurationData[type] = {};
          });
          scope.monitorFormValidator.prepareForm(scope.baseMonitorForm, true);
        } else {
          scope.baseMonitorData = _.pick(options.parameters.monitor, "id", "name", "type", "refreshInterval");
          scope.dashboard_id = null;
          scope.monitorFormValidator.prepareForm(scope.baseMonitorForm, false);
        }
        scope.editMode = options.mode;
        scope.formHelper = new jashboard.MonitorFormHelper(scope.baseMonitorForm, scope.baseMonitorData, function() {
          saveMonitor(options.parameters.dashboard);
        });
      });
    }
  });
  jashboard.application.controller("MonitorFormController", ['$scope', 'Repository', 'PluginManager', 'MonitorLayoutManager', jashboard.MonitorFormController]).run(function() {
    steal.dev.log("MonitorFormController initialized");
  });
}(jashboard || {}));
