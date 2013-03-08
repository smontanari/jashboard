(function(module) {
  jashboard.plugin.build = _.extend(module, {
    jenkinsConfigurationParser: function(data) {
      return _.clone(data);
    },
    jenkinsConfigurationValidator: function(data) {
      return _.tap(_.clone(data), function(config){
        config.port = parseInt(config.port, 10);
      });
    }
  });
  if (_.isObject(jashboard.plugin.build.buildConfigurationParser)) {
    jashboard.plugin.build.buildConfigurationParser.registerTypeHandler("jenkins", jashboard.plugin.build.jenkinsConfigurationParser);
  }
  if (_.isObject(jashboard.plugin.build.buildConfigurationValidator)) {
    jashboard.plugin.build.buildConfigurationValidator.registerTypeHandler("jenkins", jashboard.plugin.build.jenkinsConfigurationValidator);
  }
}(jashboard.plugin.build || {}));
