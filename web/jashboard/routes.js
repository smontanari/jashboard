jashboard.application.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: 'html/main_page_partial.html',
    controller: 'MainController'
  });
  // $routeProvider.when('/dashboard/:dashboard_id', {
  //   templateUrl: 'html/dashboard.html',
  //   controller: 'DashboardController'
  // });
 
  $routeProvider.when('/about', {
    templateUrl: 'html/about_partial.html'
  });

  $locationProvider.html5Mode(false);
});