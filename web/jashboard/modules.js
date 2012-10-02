var jashboard = {
  model: {},
  services: angular.module('jashboard.services', []),
  application: angular.module('jashboard', ['jashboard.services'])
};
steal.dev.log("loading jashboard modules");
steal(
  'jashboard/model/Dashboard.js',
  'jashboard/model/Monitor.js',
  'jashboard/services/HttpService.js'
)
.then('jashboard/controllers/DashboardController.js');

