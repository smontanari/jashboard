var jashboard = {
  model: {},
  services: angular.module('jashboard.services', []),
  application: angular.module('jashboard', ['jashboard.services']),
  plugin: {}
};
steal.dev.log("loading jashboard modules");
steal(
  'jashboard/constants.js',
  'jashboard/misc-functions.js',
  'jashboard/model/Dashboard.js',
  'jashboard/model/Monitor.js',
  //'jashboard/model/MonitorBuildSettings.js',
  'jashboard/model/MonitorBuildRuntime.js',
  'jashboard/model/TypeAdapter.js',
  'jashboard/services/HttpService.js',
  'jashboard/services/Repository.js',
  'jashboard/plugins/plugins.js'
)
.then(
  'jashboard/controllers/MainController.js',
  'jashboard/controllers/MenuActionsController.js',
  'jashboard/controllers/DashboardActionsController.js',
  'jashboard/controllers/DashboardFormController.js',
  'jashboard/controllers/MonitorFormController.js'
)
.then(
  'jashboard/plugins/build-plugin-jenkins.js',
  'jashboard/plugins/build-plugin-go.js'
);

