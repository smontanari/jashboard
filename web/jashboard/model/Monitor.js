jashboard.model.Monitor = function(monitorData) {
  this.id = monitorData.id;
  this.type = monitorData.type;
  this.title = monitorData.name;
  this.refreshInterval = monitorData.refresh_interval;
  this.settings = jashboard.types.monitorSettingsTypeAdapter.toObject(monitorData);
  this.runtimeInfo = {};
};
