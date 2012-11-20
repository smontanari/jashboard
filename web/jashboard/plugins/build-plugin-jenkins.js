jashboard.plugin.JenkinsPlugin = function() {
  var handler = function(data) {
    return {
      server: "Jenkins",
      hostname: data.hostname,
      port: data.port,
      build_id: data.build_id
    };
  };

  this.run = function() {
    jashboard.types.buildTypeManager.registerTypeHandler(1, handler);
  }
};

jashboard.plugin.pluginManager.addPlugin("JenkinsPlugin", jashboard.plugin.JenkinsPlugin);

