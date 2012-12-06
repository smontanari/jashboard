jashboard.plugin.build.goSettingsHandler = function(data) {
  return {
    server: "GO",
    hostname: data.hostname,
    port: data.port,
    pipeline: data.pipeline,
    stage: data.stage,
    job: data.job
  };
};

if(!_.isUndefined(jashboard.plugin.build.buildSettingsTypeAdapter)) {
  jashboard.plugin.build.buildSettingsTypeAdapter.registerTypeHandler("go", jashboard.plugin.build.goSettingsHandler);
}


