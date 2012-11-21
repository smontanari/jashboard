jashboard.types = {
  monitorSettingsTypeAdapter: new jashboard.model.TypeAdapter(),
  monitorRuntimeTypeAdapter: new jashboard.model.TypeAdapter()
};
jashboard.plugin.pluginManager = {
  addPlugin: function(name, pluginConstructor) {
    var plugin = new pluginConstructor.prototype.constructor();
    plugin.initialize();
    steal.dev.log("Plugin: '" + name + "' initialized");
  }
};
