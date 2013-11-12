(function() {
  var JASHBOARD_ENVIRONMENT = 'development';
  var environment = {
    development: {
      application: 'jashboard/jashboard_loader.js',
      stylesheet: 'css/jashboard.less'
    },
    production: {
      application: 'app/jashboard.min.js',
      stylesheet: 'app/jashboard.min.css'
    }
  };

  steal(
    'underscore',
    'jquery',
    'jquery-ui',
    'blockUI',
    'cycle2',
    'bootstrap',
    'bootstrap-switch',
    'moment',
    'angular',
    'angular-ui',
    environment[JASHBOARD_ENVIRONMENT].stylesheet,
    function() {
      steal(environment[JASHBOARD_ENVIRONMENT].application);
    });
})();
