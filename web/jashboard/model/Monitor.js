jashboard.defineModule("jashboard.model", function() {
  jashboard.model.Monitor = function(monitorData) {
    var setPosition = function(position) {
      if(_.isObject(position)) {
        return {position: 'absolute', top: position.top, left: position.left};
      }
    };
    
    this.id = monitorData.id;
    this.type = monitorData.type;
    this.name = monitorData.name;
    this.loadingStatus = jashboard.model.loadingStatus.waiting;
    this.refreshInterval = monitorData.refresh_interval;
    this.position = setPosition(monitorData.position);
    this.configuration = {};
    this.runtimeInfo = {};

    this.runtimeInfoSynchroniser = function(callback) {
      this.loadingStatus = jashboard.model.loadingStatus.waiting;
      var self = this;
      return function(runtimeData) {
        self.runtimeInfo = runtimeData;
        self.loadingStatus = jashboard.model.loadingStatus.completed;
        if(_.isFunction(callback)) {
          callback(self);
        }
      };
    };
  };
});