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
        var monitorAdapter = pluginManager.findMonitorAdapter(scope.baseMonitorData.type);
        return  {
          name: scope.baseMonitorData.name,
          refreshInterval: parseInt(scope.baseMonitorData.refreshInterval, 10),
          type: scope.baseMonitorData.type,
          configuration: monitorAdapter.parseMonitorConfigurationForm(scope.monitorConfigurationFormModel[scope.baseMonitorData.type])
        };
      };
      var createMonitor = function(dashboard) {
        var monitorType = scope.baseMonitorData.type;
        var monitorAdapter = pluginManager.findMonitorAdapter(monitorType);
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

      scope.availableMonitorTypes = pluginManager.getAllMonitorTypes();
      scope.monitorConfigurationFormModel = {};

      scope.$on("OpenMonitorDialog", function(event, options) {
        if (options.mode === jashboard.inputOptions.createMode) {
          scope.baseMonitorData = {
            id: null,
            name: null,
            refreshInterval: null,
            type: _.first(scope.availableMonitorTypes)
          };
          scope.formHelper = new jashboard.MonitorFormHelper(scope.baseMonitorForm, scope.baseMonitorData, function() {
            createMonitor(options.parameters.dashboard);
          });
        } else if (options.mode === jashboard.inputOptions.updateMode) {
          var monitor = options.parameters.monitor;
          scope.baseMonitorData = _.pick(monitor, "id", "name", "refreshInterval", "type");
          scope.monitorConfigurationFormModel[monitor.type] = monitor.configuration;
          scope.formHelper = new jashboard.MonitorFormHelper(scope.baseMonitorForm, scope.baseMonitorData, function() {
            updateMonitor(options.parameters.monitor);
          });
        }
        scope.$editMode = options.mode;
      });
    }
  });
  jashboard.application.controller("MonitorFormController", ['$scope', 'Repository', 'PluginManager', 'MonitorLayoutManager', jashboard.MonitorFormController]).run(function() {
    steal.dev.log("MonitorFormController initialized");
  });
}(jashboard || {}));
