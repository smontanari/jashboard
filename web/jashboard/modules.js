var jashboard = {
  services: angular.module('jashboard.services', []),
  application: angular.module('jashboard', ['jashboard.services'])
};
steal.dev.log("loading jashboard modules");
steal('jashboard/services/HttpService.js')
.then('jashboard/controllers/DashboardController.js');

