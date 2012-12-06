jashboard.plugin.build.jenkinsSettingsHandler = function(data) {
  return {
    server: "Jenkins",
    hostname: data.hostname,
    port: data.port,
    build_id: data.build_id
  };
};

if(!_.isUndefined(jashboard.plugin.build.buildSettingsTypeAdapter)) {
  jashboard.plugin.build.buildSettingsTypeAdapter.registerTypeHandler("jenkins", jashboard.plugin.build.jenkinsSettingsHandler);
}

