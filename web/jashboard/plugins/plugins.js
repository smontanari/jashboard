jashboard.types = {
  buildSettingsTypeManager: new jashboard.model.TypeAdapter()
};
jashboard.plugin.pluginManager = {
  addPlugin: function(name, pluginConstructor) {
    var plugin = new pluginConstructor.prototype.constructor();
    plugin.run();
    steal.dev.log("Added plugin: '" + name + "'");
  }
};
