(function() {
  steal.config({
    root: steal.config('root').join('../'),
    map: {
      "*": {
        "jquery/jquery.js" : "jquery",
        'underscore/underscore.js': 'underscore',
        'bootstrap/bootstrap.js': 'bootstrap',
        'bootstrap-switch/bootstrap-switch.js': 'bootstrap-switch',
        'jquery-ui/jquery-ui.js': 'jquery-ui',
        'blockUI/blockUI.js': 'blockUI',
        'cycle2/cycle2.js': 'cycle2',
        'moment/moment.js': 'moment',
        'angular/angular.js': 'angular',
        'angular-ui/angular-ui.js': 'angular-ui'
      }
    },
    paths: {
      'jquery':                   'bower_components/jquery/jquery.min.js',
      'bootstrap':                'bower_components/bootstrap/docs/assets/js/bootstrap.min.js',
      'bootstrap.css':            'bower_components/bootstrap/docs/assets/css/bootstrap.css',
      'bootstrap-responsive.css': 'bower_components/bootstrap/docs/assets/css/bootstrap-responsive.css',
      'bootstrap-switch':         'bower_components/bootstrap-switch/static/js/bootstrap-switch.min.js',
      'bootstrap-switch.css':     'bower_components/bootstrap-switch/static/stylesheets/bootstrap-switch.css',
      'jquery-ui':                'bower_components/jquery-ui/ui/minified/jquery-ui.min.js',
      'jquery-ui.css':            'bower_components/jquery-ui/themes/base/minified/jquery-ui.min.css',
      'blockUI':                  'bower_components/blockui/jquery.blockUI.js',
      'cycle2':                   'lib/jquery.cycle2.min.js',
      'moment':                   'bower_components/moment/min/moment.min.js',
      'underscore':               'bower_components/underscore/underscore-min.js',
      'angular':                  'bower_components/angular/angular.min.js',
      'angular-ui':               'bower_components/angular-ui/build/angular-ui.min.js',
      'angular-ui.css':           'bower_components/angular-ui/build/angular-ui.min.css'
    },
    shim : {
      'bootstrap': {
        deps: ['jquery', 'jquery-ui', 'bootstrap.css', 'bootstrap-responsive.css']
      },
      'bootstrap-switch': {
        deps: ['bootstrap', 'bootstrap-switch.css']
      },
      'jquery': {
        exports: "jQuery"
      },
      'jquery-ui': {
        deps: ['jquery', 'jquery-ui.css']
      },
      'blockUI': {
        deps: ['jquery']
      },
      'cycle2': {
        deps: ['jquery-ui']
      },
      'angular': {
        deps: ['jquery'],
        exports: 'angular'
      },
      'angular-ui': {
        deps: ['angular', 'angular-ui.css']
      }
    },
    ext: {
      js: "js",
      css: "css",
      less: "lib/steal/less/less.js"
    }
  });
})();