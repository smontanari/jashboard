(function(module) {
  jashboard.plugin.build = _.extend(module, {
    goConfigurationParser: function(data) {
      return _.clone(data);
    },
    goConfigurationValidator: function(data) {
      return _.tap(_.clone(data), function(config){
        config.port = parseInt(config.port, 10);
      });
    }
  });
  if (_.isObject(jashboard.plugin.build.buildConfigurationParser)) {
    jashboard.plugin.build.buildConfigurationParser.registerTypeHandler("go", jashboard.plugin.build.goConfigurationParser);
  }
  if (_.isObject(jashboard.plugin.build.buildConfigurationValidator)) {
    jashboard.plugin.build.buildConfigurationValidator.registerTypeHandler("go", jashboard.plugin.build.goConfigurationValidator);
  }
}(jashboard.plugin.build || {}));
