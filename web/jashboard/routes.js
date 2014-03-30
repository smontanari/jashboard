(function(module) {
  jashboard = _.extend(module, {
    viewMapping: {
      main: '/',
      about: '/about'
    },
    defineRoutes: function(routeProvider, locationProvider) {
      routeProvider.when(jashboard.viewMapping.main, {
        templateUrl: 'html/main_page_partial.html'
      }); 
      routeProvider.when(jashboard.viewMapping.about, {
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
