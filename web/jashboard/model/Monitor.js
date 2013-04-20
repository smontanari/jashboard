(function(module) {
  jashboard.model = _.extend(module, {
    Monitor: function(monitorData) {
      var self = this;
      _.each(["id", "type", "name", "refreshInterval", "position", "size"], function(property) {
        self[property] = monitorData[property];
      });
      this.configuration = monitorData.configuration || {};
      this.runtimeInfo = {};

      this.cssLayout = function() {
        var css = {};
        if (_.isObject(this.position)) {
          css = _.extend({position: 'absolute'}, this.position);
        }
        if (_.isObject(this.size)) {
          css = _.extend(css, this.size);
        }
        return css;
      };
    }
  });
}(jashboard.model || {}));
