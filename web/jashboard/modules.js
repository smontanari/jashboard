var jashboard = {
  model: {},
  services: angular.module('jashboard.services', []),
  application: angular.module('jashboard', ['jashboard.services']),
  plugin: {}
};
steal.dev.log("loading jashboard modules");
steal(
  'jashboard/misc-functions.js',
  'jashboard/model/Dashboard.js',
  'jashboard/model/Monitor.js',
  'jashboard/model/CreateMonitorWorkflow.js',
  'jashboard/services/HttpService.js',
  'jashboard/services/Repository.js',
  'jashboard/plugins/TypeAdapter.js',
  'jashboard/services/PluginManager.js'
)
.then(
  'jashboard/controllers/MainController.js',
  'jashboard/controllers/MenuActionsController.js',
  'jashboard/controllers/DashboardContentController.js',
  'jashboard/controllers/DashboardFormController.js',
  'jashboard/controllers/MonitorFormController.js'
)
.then(
  'jashboard/plugins.js'
);

