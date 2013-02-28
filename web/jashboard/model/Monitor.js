(function(module) {
  jashboard.model = _.extend(module, {
    Monitor: function(monitorData) {
      this.cssLayout = function() {
        var css = {};
        if(_.isObject(this.position)) {
          css = _.extend({position: 'absolute'}, this.position);
        }
        if(_.isObject(this.size)) {
          css = _.extend(css, this.size);
        }
        return css;
      };

      this.id = monitorData.id;
      this.type = monitorData.type;
      this.name = monitorData.name;
      this.refreshInterval = monitorData.refresh_interval;
      this.position = monitorData.position;
      this.size = monitorData.size;
      this.configuration = {};
      this.runtimeInfo = {};
    }
  });
}(jashboard.model || {}));
