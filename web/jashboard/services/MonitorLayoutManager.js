(function(module) {
  jashboard = _.extend(module, {
    MonitorLayoutManager: function(intersectionDetector, positioningStrategy) {
      var defaultPosition = {top: 0, left: 0};
      var margin = 20;

      var sizeWithMargin = function(originalSize) {
        return {
          width: originalSize.width + margin,
          height: originalSize.height + margin
        };
      };

      var orderMonitorsByDistanceFromTopLeftCorner = function(monitors) {
        return _.sortBy(monitors, function(monitor) {
          return (monitor.position.top + 2 * monitor.position.left);
        });
      };

      var noOverlapWithMonitors = function(location, monitors) {
        return !_.some(monitors, function(monitor) {
          return intersectionDetector.intersect(location, {position: monitor.position, size: sizeWithMargin(monitor.size)});
        });
      };

      var findAvailablePosition = function(positions, otherMonitors, monitorSize) {
        return _.find(positions, function(candidatePosition) {
          return noOverlapWithMonitors({ position: candidatePosition, size: monitorSize }, otherMonitors);
        });
      };

      this.nextAvailableMonitorPosition = function(dashboard, monitorSize) {
        if (_.isEmpty(dashboard.monitors)) {
          return defaultPosition;
        }
        var monitors = orderMonitorsByDistanceFromTopLeftCorner(dashboard.monitors);
        if (noOverlapWithMonitors({position: defaultPosition, size: monitorSize}, monitors)) {
          return defaultPosition;
        }
        for (var i = 0; i < monitors.length; i++) {
          var otherMonitors = _.without(monitors, monitors[i]);
          var location = {position: monitors[i].position, size: sizeWithMargin(monitors[i].size)};
          var positions = positioningStrategy.neighbourPositions(location, monitorSize);
          var availablePosition = findAvailablePosition(positions, otherMonitors, monitorSize);
          if (_.isObject(availablePosition)) {
            return availablePosition;
          }
        }
        var lastMonitor = _.last(monitors);
        return {top: (lastMonitor.position.top + lastMonitor.size.height + margin), left: 0};
      };
    }
  });
  jashboard.services.service('MonitorLayoutManager', ['IntersectionDetector', 'MonitorPositioningStrategy', jashboard.MonitorLayoutManager])
  .run(['$log', function(log) {
    log.info("MonitorLayoutManager initialized");
  }]);
}(jashboard || {}));
