jashboard.plugin.BuildMonitorPlugin = function() {
  var handler = function(data) {
    return jashboard.types.buildSettingsTypeManager.toObject(data.settings);
  };
  this.initialize = function() {
    jashboard.types.buildSettingsTypeManager = new jashboard.model.TypeAdapter();
    jashboard.types.monitorSettingsTypeManager.registerTypeHandler(1, handler);
  };
};

jashboard.plugin.pluginManager.addPlugin("BuildMonitorPlugin", jashboard.plugin.BuildMonitorPlugin);
