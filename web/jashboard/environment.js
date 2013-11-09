var jashboard = (function(module) {
  module.environments = {
    development: [
      {
        resourceName: "css",
        resourceSet: [
          "css/bootstrap.css",
          "css/bootstrap-responsive.css",
          "css/bootstrapSwitch.css",
          "bower_components/jquery-ui/themes/base/jquery-ui.css",
          "bower_components/angular-ui/build/angular-ui.css"
        ]
      },
      {
        resourceName: "jquery",
        resourceSet: ["bower_components/jquery/jquery.js"]
      },
      {
        resourceName: "lib",
        resourceSet: [
          "lib/bootstrap.js",
          "lib/bootstrapSwitch.js", 
          "lib/jquery.cycle2.js",
          "bower_components/underscore/underscore.js",
          "bower_components/blockui/jquery.blockUI.js",
          "bower_components/jquery-ui/ui/jquery-ui.js",
          "bower_components/moment/moment.js",
          "bower_components/angular/angular.js"
        ]
      },
      {
        resourceName: "angular-ui",
        resourceSet: ["bower_components/angular-ui/build/angular-ui.js"]
      },
      {
        resourceName: "jashboard.less",
        resourceSet: ["css/jashboard.less"]
      },
      {
        resourceName: "mainFile",
        resourceSet: ["jashboard/jashboard_loader.js"]
      },
      {
        resourceName: "testScenarios",
        resourceSet: ["test/funcunit/test_scenario_loader.js"]
      }
    ],
    production: [
      {
        resourceName: "css",
        resourceSet: [
          "css/bootstrap.min.css",
          "css/bootstrap-responsive.min.css",
          "css/bootstrapSwitch.css",
          "css/jashboard.min.css",
          "bower_components/jquery-ui/themes/base/minified/jquery-ui.min.css",
          "bower_components/angular-ui/build/angular-ui.min.css"
        ]
      },
      {
        resourceName: "jquery",
        resourceSet: ["bower_components/jquery/jquery.min.js"]
      },
      {
        resourceName: "lib",
        resourceSet: [
          "lib/bootstrap.min.js",
          "lib/bootstrapSwitch.js", 
          "lib/jquery.cycle2.min.js",
          "bower_components/underscore/underscore-min.js",
          "bower_components/blockui/jquery.blockUI.js",
          "bower_components/jquery-ui/ui/minified/jquery-ui.min.js",
          "bower_components/moment/min/moment.min.js",
          "bower_components/angular/angular.min.js"
        ]
      },
      {
        resourceName: "angular-ui",
        resourceSet: ["bower_components/angular-ui/build/angular-ui.min.js"]
      },
      {
        resourceName: "mainFile",
        resourceSet: ["lib/jashboard.min.js"]
      }
    ]
  };
  return module;
}(jashboard || {}));

