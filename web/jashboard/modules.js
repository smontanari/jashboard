var jashboard = {
  model: {},
  services: angular.module('jashboard.services', []),
  application: angular.module('jashboard', ['jashboard.services'])
};
steal.dev.log("loading jashboard modules");
steal(
  'jashboard/constants.js',
  'jashboard/misc-functions.js',
  'jashboard/model/Dashboard.js',
  'jashboard/model/Monitor.js',
  'jashboard/model/MonitorBuildSettings.js',
  'jashboard/model/MonitorBuildRuntime.js',
  'jashboard/services/HttpService.js',
  'jashboard/services/Repository.js'
)
.then(
  'jashboard/controllers/MainController.js',
  'jashboard/controllers/MenuController.js',
  'jashboard/controllers/DashboardController.js',
  'jashboard/controllers/DialogController.js'
);

