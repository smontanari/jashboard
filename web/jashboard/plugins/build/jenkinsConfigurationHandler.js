(function(module) {
  jashboard.plugin.build = _.extend(module, {
    jenkins: {parseFormConfiguration: _.clone, convertMonitorConfigurationToFormModel: _.clone}
  });
}(jashboard.plugin.build || {}));
