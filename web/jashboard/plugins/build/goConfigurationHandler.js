jashboard.plugin.build.goConfigurationHandler = function(data) {
  return {
    server: "GO",
    hostname: data.hostname,
    port: data.port,
    pipeline: data.pipeline,
    stage: data.stage,
    job: data.job
  };
};

if(!_.isUndefined(jashboard.plugin.build.buildConfigurationTypeAdapter)) {
  jashboard.plugin.build.buildConfigurationTypeAdapter.registerTypeHandler("go", jashboard.plugin.build.goConfigurationHandler);
}


