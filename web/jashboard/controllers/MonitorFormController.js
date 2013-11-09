(function(module) {
  jashboard = _.extend(module, {
    MonitorFormController: function(scope, repository, pluginManager, monitorLayoutManager) {
      var invokeRepository = function(repositoryFn, parameters, onSuccess) {
        scope.$emit("MonitorSaveStart");
        parameters.push({
          success: function(data) {
            onSuccess(data);
            scope.$apply();
            scope.$emit("MonitorSaveComplete");
          },
          error: function() {
            scope.$emit("AjaxError");
          }
        });
        repositoryFn.apply(null, parameters);
        scope.$emit("CloseMonitorDialog");
      };
      var parseMonitorForm = function() {
        var monitorAdapter = pluginManager.monitorAdapters[scope.monitorFormModel.type];
        return  {
          name: scope.monitorFormModel.name,
          refreshInterval: parseInt(scope.monitorFormModel.refreshInterval, 10),
          type: scope.monitorFormModel.type,
          configuration: monitorAdapter.parseMonitorConfigurationForm(scope.monitorConfigurationFormModel[scope.monitorFormModel.type])
        };
      };
      var createMonitor = function(dashboard) {
        var monitorAdapter = pluginManager.monitorAdapters[scope.monitorFormModel.type];
        var monitorModel = parseMonitorForm();
        var monitorParameters = _.extend(monitorModel, {
          size: monitorAdapter.defaultSize(),
          position: monitorLayoutManager.nextAvailableMonitorPosition(dashboard, monitorAdapter.defaultSize())
        });
        invokeRepository(repository.createMonitor, [dashboard.id, monitorParameters], function(monitor) {
          dashboard.monitors.push(monitor);
        });
      };
      var updateMonitor = function(monitor) {
        var monitorModel = parseMonitorForm();
        var monitorParameters = _.extend(monitorModel, { id: monitor.id });
        invokeRepository(repository.updateMonitorConfiguration, [monitorParameters], function() {
          monitor.name = monitorModel.name;
          monitor.refreshInterval = monitorModel.refreshInterval;
          monitor.configuration = monitorModel.configuration;
        });
      };

      scope.availableMonitorTypes = _.keys(pluginManager.monitorAdapters);
      scope.monitorConfigurationFormModel = {};

      scope.$on("OpenMonitorDialog", function(event, options) {
        if (options.mode === jashboard.model.inputOptions.createMode) {
          scope.monitorFormModel = {
            id: null,
            name: null,
            refreshInterval: null,
            type: _.first(scope.availableMonitorTypes)
          };
          scope.formHelper = new jashboard.MonitorFormHelper(scope.baseMonitorForm, scope.monitorFormModel, function() {
            createMonitor(options.parameters.dashboard);
          });
        } else if (options.mode === jashboard.model.inputOptions.updateMode) {
          var monitor = options.parameters.monitor;
          var monitorAdapter = pluginManager.monitorAdapters[monitor.type];
          scope.monitorFormModel = _.pick(monitor, "id", "name", "refreshInterval", "type");
          scope.monitorConfigurationFormModel[monitor.type] = monitorAdapter.convertMonitorConfigurationToFormModel(monitor.configuration);
          scope.formHelper = new jashboard.MonitorFormHelper(scope.baseMonitorForm, scope.monitorFormModel, function() {
            updateMonitor(options.parameters.monitor);
          });
        }
        scope.$editMode = options.mode;
      });
    }
  });
  jashboard.application.controller("MonitorFormController", ['$scope', 'Repository', 'PluginManager', 'MonitorLayoutManager', jashboard.MonitorFormController])
  .run(['$log', function(log) {
    log.info("MonitorFormController initialized");
  }]);
}(jashboard || {}));
