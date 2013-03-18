(function(module) {
  jashboard = _.extend(module, {
    MonitorLayoutManager: function() {
      this.nextAvailableMonitorPosition = function(dashboard) {
        var bottomMostMonitor = _.max(dashboard.monitors, function(monitor) {
          return (monitor.position.top + monitor.size.height);
        });
        if (_.isObject(bottomMostMonitor)) {
          return {top: bottomMostMonitor.position.top + bottomMostMonitor.size.height + 20, left: 0};
        }
        return {top: 0, left: 0};
      };
    }
  });
  jashboard.services.service('MonitorLayoutManager', [jashboard.MonitorLayoutManager]).run(function() {
    steal.dev.log("MonitorLayoutManager initialized");
  });
}(jashboard || {}));
