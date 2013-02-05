jashboard.defineNamespace("jashboard.model", function() {
  jashboard.model.Monitor = function(monitorData) {
    this.id = monitorData.id;
    this.type = monitorData.type;
    this.name = monitorData.name;
    this.refreshInterval = monitorData.refresh_interval;
    this.configuration = {};
    this.runtimeInfo = {};
  };
});