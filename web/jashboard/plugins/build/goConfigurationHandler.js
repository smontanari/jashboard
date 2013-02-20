(function(module) {
  jashboard.plugin.build = _.extend(module, {
    goConfigurationHandler: function(data) {
      return {
        server: "GO",
        hostname: data.hostname,
        port: data.port,
        pipeline: data.pipeline,
        stage: data.stage,
        job: data.job
      };
    }
  });
  if(_.isObject(jashboard.plugin.build.buildConfigurationTypeAdapter)) {
    jashboard.plugin.build.buildConfigurationTypeAdapter.registerTypeHandler("go", jashboard.plugin.build.goConfigurationHandler);
  }
}(jashboard.plugin.build || {}));
