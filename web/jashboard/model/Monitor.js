(function(module) {
  jashboard.model = _.extend(module, {
    Monitor: function(monitorData) {
      this.setPosition = function(position) {
        if(_.isObject(position)) {
          this.position = position;
          this.cssPosition = _.extend({position: 'absolute'}, this.position);
        }
      };

      this.id = monitorData.id;
      this.type = monitorData.type;
      this.name = monitorData.name;
      this.refreshInterval = monitorData.refresh_interval;
      this.setPosition(monitorData.position);
      this.configuration = {};
      this.runtimeInfo = {};
    }
  });
}(jashboard.model || {}));
