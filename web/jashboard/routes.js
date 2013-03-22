(function(module) {
  jashboard = _.extend(module, {
    defineRoutes: function($routeProvider, $locationProvider) {
      $routeProvider.when('/', {
        templateUrl: 'html/main_page_partial.html'
      }); 
      $routeProvider.when('/about', {
        templateUrl: 'html/about_partial.html'
      });

      $locationProvider.html5Mode(false);
    }
  });

  jashboard.application.config(jashboard.defineRoutes).run(function() {
    steal.dev.log("Routes definition completed");
  });;
}(jashboard || {}));
