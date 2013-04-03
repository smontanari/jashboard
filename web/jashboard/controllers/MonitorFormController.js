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
          configuration: monitorAdapter.parseMonitorConfigurationForm(scope.monitorConfigurationFormModel[scope.baseMonitorData.type])
        };
      };
      var convertFormModelToData = function(model) {
        var monitorAdapter = pluginManager.findMonitorAdapter(scope.baseMonitorData.type);
        return {
          name: model.name,
          refreshInterval: model.refreshInterval,
          configuration: monitorAdapter.convertMonitorConfigurationToData(model.configuration)
        };
      };
      var createMonitor = function(dashboard) {
        var monitorType = scope.baseMonitorData.type;
        var monitorAdapter = pluginManager.findMonitorAdapter(monitorType);
        var monitorFormModel = parseMonitorForm();
        var configurationData = convertFormModelToData(monitorFormModel);
        var monitorParameters = _.extend(configurationData, {
          type: monitorType,
          size: monitorAdapter.defaultSize(),
          position: monitorLayoutManager.nextAvailableMonitorPosition(dashboard, monitorAdapter.defaultSize())
        });
        invokeRepository(repository.createMonitor, [dashboard.id, monitorParameters], function(monitor) {
          dashboard.monitors.push(monitor);
        });
      };
      var updateMonitor = function(monitor) {
        var monitorFormModel = parseMonitorForm();
        var configurationData = convertFormModelToData(monitorFormModel);
        invokeRepository(repository.updateMonitorConfiguration, [monitor.id, configurationData], function() {
          monitor.name = monitorFormModel.name;
          monitor.refreshInterval = monitorFormModel.refreshInterval;
          monitor.configuration = monitorFormModel.configuration;
        });
      };

      var validationRules = new jashboard.MonitorFormValidationRules(scope);
      scope.availableMonitorTypes = pluginManager.getAllMonitorTypes();
      scope.monitorConfigurationFormModel = {};
      scope.monitorFormValidator = new jashboard.FormValidator();

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
            scope.monitorConfigurationFormModel[type] = {};
          });
          scope.monitorFormValidator.prepareFormForCreate(scope.baseMonitorForm, validationRules);
          scope.formHelper = new jashboard.MonitorFormHelper(scope.baseMonitorForm, scope.baseMonitorData, function() {
            createMonitor(options.parameters.dashboard);
          });
        } else {
          scope.baseMonitorData = _.pick(options.parameters.monitor, "id", "name", "type", "refreshInterval");
          scope.dashboard_id = null;
          scope.monitorFormValidator.prepareFormForUpdate(scope.baseMonitorForm, validationRules);
          scope.formHelper = new jashboard.MonitorFormHelper(scope.baseMonitorForm, scope.baseMonitorData, function() {
            updateMonitor(options.parameters.monitor);
          });
        }
        scope.editMode = options.mode;
      });
    }
  });
  jashboard.application.controller("MonitorFormController", ['$scope', 'Repository', 'PluginManager', 'MonitorLayoutManager', jashboard.MonitorFormController]).run(function() {
    steal.dev.log("MonitorFormController initialized");
  });
}(jashboard || {}));
