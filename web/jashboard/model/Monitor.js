jashboard.model.Monitor = function(monitorData) {
  this.id = monitorData.id;
  this.type = 1;
  this.title = monitorData.name;
  this.refreshInterval = monitorData.refresh_interval;
  this.settings = jashboard.types.monitorSettingsTypeManager.toObject(monitorData);
  this.runtimeInfo = {};
};
