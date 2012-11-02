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
  'jashboard/services/HttpService.js'
)
.then(
  'jashboard/controllers/DashboardController.js',
  'jashboard/controllers/MonitorController.js'
);

