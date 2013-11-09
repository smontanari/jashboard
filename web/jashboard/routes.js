(function(module) {
  jashboard = _.extend(module, {
    defineRoutes: function(routeProvider, locationProvider) {
      routeProvider.when('/', {
        templateUrl: 'html/main_page_partial.html'
      }); 
      routeProvider.when('/about', {
        templateUrl: 'html/about_partial.html'
      });

      locationProvider.html5Mode(false);
    }
  });

  jashboard.application.config(['$routeProvider', '$locationProvider', jashboard.defineRoutes])
  .run(['$log', function(log) {
    log.info("Routes definition completed");
  }]);
}(jashboard || {}));
