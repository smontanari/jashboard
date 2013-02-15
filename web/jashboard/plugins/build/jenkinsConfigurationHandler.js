jashboard.defineModule("jashboard.plugin.build", function() {
  jashboard.plugin.build.jenkinsConfigurationHandler = function(data) {
    return {
      server: "Jenkins",
      hostname: data.hostname,
      port: data.port,
      build_id: data.build_id
    };
  };

  if(_.isObject(jashboard.plugin.build.buildConfigurationTypeAdapter)) {
    jashboard.plugin.build.buildConfigurationTypeAdapter.registerTypeHandler("jenkins", jashboard.plugin.build.jenkinsConfigurationHandler);
  }
});

