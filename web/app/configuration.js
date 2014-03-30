(function() {
  var JASHBOARD_ENVIRONMENT = 'development';

  var environment = {
    development: {
      application: 'jashboard/development_loader',
      stylesheet: 'less!style/jashboard'
    },
    production: {
      application: 'app/jashboard.min',
      stylesheet: 'css!app/jashboard.min'
    }
  };

  require.config({
    baseUrl: '.',
    paths: {
      'css':                        'bower_components/require-css/css',
      'less':                       'bower_components/require-less/less',
      'underscore':                 'bower_components/underscore/underscore',
      'jquery':                     'bower_components/jquery/jquery.min',
      'bootstrap':                  'bower_components/bootstrap/docs/assets/js/bootstrap.min',
      'bootstrap-style':            'bower_components/bootstrap/docs/assets/css/bootstrap',
      'bootstrap-responsive-style': 'bower_components/bootstrap/docs/assets/css/bootstrap-responsive',
      'bootstrap-switch':           'bower_components/bootstrap-switch/build/js/bootstrap-switch.min',
      'bootstrap-switch-style':     'bower_components/bootstrap-switch/build/css/bootstrap2/bootstrap-switch',
      'jquery-ui':                  'bower_components/jquery-ui/ui/minified/jquery-ui.min',
      'jquery-ui-style':            'bower_components/jquery-ui/themes/base/minified/jquery-ui.min',
      'blockUI':                    'bower_components/blockui/jquery.blockUI',
      'cycle2':                     'lib/jquery.cycle2.min',
      'moment':                     'bower_components/moment/min/moment.min',
      'angular':                    'bower_components/angular/angular.min',
      'angular-route':              'bower_components/angular-route/angular-route.min',
      'angular-ui':                 'bower_components/angular-ui-utils/ui-utils.min',
      'jashboard-main':              environment[JASHBOARD_ENVIRONMENT].application
    },
    map: {
      '*': {
        'css': 'bower_components/require-css/css',
        'less': 'bower_components/require-less/less'
      }
    },
    shim: {
      'underscore': {
        exports: '_'
      },
      'bootstrap': ['jquery', 'jquery-ui', 'css!bootstrap-style', 'css!bootstrap-responsive-style'],
      'bootstrap-switch': ['bootstrap', 'css!bootstrap-switch-style'],
      'jquery': {
        exports: "jQuery"
      },
      'jquery-ui': ['jquery', 'css!jquery-ui-style'],
      'blockUI': ['jquery'],
      'cycle2': ['jquery-ui'],
      'moment': {
        exports: 'moment'
      },
      'angular': {
        deps: ['jquery'],
        exports: 'angular'
      },
      'angular-route': ['angular'],
      'angular-ui': ['angular'],
      'jashboard-main': [
        'underscore',
        'angular',
        'angular-route',
        'angular-ui',
        'blockUI',
        'cycle2',
        'moment',
        'bootstrap',
        'bootstrap-switch'
       ]
    }
  });

  require(['jashboard-main'], function(application) {
    require([environment[JASHBOARD_ENVIRONMENT].stylesheet]);
    application.run();
    console.info('jashboard running!');
  });
})();
