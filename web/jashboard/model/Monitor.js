jashboard.model.Monitor = function(monitorData) {
  var getSettings = function(type, settings) {
    switch(type) {
      case 1:
        return jashboard.types.buildSettingsTypeManager.toObject(settings);
      default:
        throw("Undefined monitor type: " + type);
    }
  };

  this.id = monitorData.id;
  //this.type = "Build";
  this.title = monitorData.name;
  this.refreshInterval = monitorData.refresh_interval;
  this.settings = getSettings(monitorData.type, monitorData.settings);
  this.runtimeInfo = {};
};
