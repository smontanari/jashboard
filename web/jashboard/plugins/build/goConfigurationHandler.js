(function(module) {
  jashboard.plugin.build = _.extend(module, {
    go: {parseFormConfiguration: _.clone, convertMonitorConfigurationToFormModel: _.clone} 
  });
}(jashboard.plugin.build || {}));
