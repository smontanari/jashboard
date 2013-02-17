jashboard.defineModule("jashboard.model", function() {
  jashboard.model.Monitor = function(monitorData) {
    this.id = monitorData.id;
    this.type = monitorData.type;
    this.name = monitorData.name;
    this.loadingStatus = jashboard.model.loadingStatus.waiting;
    this.refreshInterval = monitorData.refresh_interval;
    this.position = monitorData.position;
    this.configuration = {};
    this.runtimeInfo = {};

    this.updateRuntimeInfo = function(info) {
      this.runtimeInfo = info;
      this.loadingStatus = jashboard.model.loadingStatus.completed;
    };
  };
});