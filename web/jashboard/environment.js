var jashboard = (function(module) {
  module.environments = {
    development: [
      {
        resourceName: "css",
        resourceSet: [
          "css/bootstrap.css",
          "css/bootstrapSwitch.css",
          "css/jquery-ui/jquery-ui-1.10.1.custom.min.css",
          "css/angular-ui.css"
        ]
      },
      {
        resourceName: "jquery",
        resourceSet: ["jquery"]
      },
      {
        resourceName: "lib",
        resourceSet: [
          "lib/underscore.js",
          "lib/bootstrap.js",
          "lib/bootstrapSwitch.js", 
          "lib/jquery.blockUI.js",
          "lib/jquery-ui-1.10.1.custom.min.js",
          "lib/jquery.cycle2.js",
          "lib/moment.js",
          "lib/angular.js"
        ]
      },
      {
        resourceName: "angular-ui",
        resourceSet: ["lib/angular-ui.js"]
      },
      {
        resourceName: "less",
        resourceSet: ["steal/less"]
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
          "css/bootstrapSwitch.css",
          "css/jquery-ui/jquery-ui-1.10.1.custom.min.css",
          "css/angular-ui.min.css",
          "css/jashboard.min.css"
        ]
      },
      {
        resourceName: "jquery",
        resourceSet: ["lib/jquery-1.9.1.min.js"]
      },
      {
        resourceName: "lib",
        resourceSet: [
          "lib/underscore-min.js",
          "lib/bootstrap.min.js",
          "lib/bootstrapSwitch.js", 
          "lib/jquery.blockUI.js",
          "lib/jquery-ui-1.10.1.custom.min.js",
          "lib/jquery.cycle2.min.js",
          "lib/moment.min.js",
          "lib/angular.min.js"
        ]
      },
      {
        resourceName: "angular-ui",
        resourceSet: ["lib/angular-ui.min.js"]
      },
      {
        resourceName: "mainFile",
        resourceSet: ["lib/jashboard.min.js"]
      },
      {
        resourceName: "testScenarios",
        resourceSet: ["test/funcunit/test_scenario_loader.js"]
      }
    ]
  };
  return module;
}(jashboard || {}));

