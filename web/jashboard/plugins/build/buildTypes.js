(function(module) {
  jashboard.plugin.build = _.extend(module, {
    buildTypes: [
      'jenkins',
      'go'
    ]
  });
}(jashboard.plugin.build || {}));
