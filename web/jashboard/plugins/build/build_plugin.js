(function(module) {
  jashboard.plugin.build = _.extend(module, {
    buildTypes: [
      'jenkins',
      'go'
    ]
  });

  steal(
    'jashboard/plugins/build/BuildMonitorAdapter.js',
    'jashboard/plugins/build/BuildMonitorFormController.js'
  ).then(function() {
    _.each(jashboard.plugin.build.buildTypes, function(buildType) {
      steal(
        "jashboard/plugins/build/" + buildType + "ConfigurationHandler.js"
      );  
    });
  });
}(jashboard.plugin.build || {}));
