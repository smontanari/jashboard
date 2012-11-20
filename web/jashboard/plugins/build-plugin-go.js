jashboard.plugin.GOPlugin = function() {
  var handler = function(data) {
    return {
      server: "GO",
      hostname: data.hostname,
      port: data.port,
      pipeline: data.pipeline,
      stage: data.stage,
      job: data.job
    };
  };

  this.run = function() {
    jashboard.types.buildSettingsTypeManager.registerTypeHandler(2, handler);
  }
};

jashboard.plugin.pluginManager.addPlugin("GOPlugin", jashboard.plugin.GOPlugin);


