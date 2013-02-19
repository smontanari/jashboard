jashboard.defineModule("jashboard.model", function() {
  jashboard.model.Monitor = function(monitorData) {
    this.setPosition = function(position) {
      if(_.isObject(position)) {
        this.position = position;
        this.cssPosition = _.extend({position: 'absolute'}, this.position);
      }
    };

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

    this.id = monitorData.id;
    this.type = monitorData.type;
    this.name = monitorData.name;
    this.loadingStatus = jashboard.model.loadingStatus.waiting;
    this.refreshInterval = monitorData.refresh_interval;
    this.setPosition(monitorData.position);
    this.configuration = {};
    this.runtimeInfo = {};
  };
});