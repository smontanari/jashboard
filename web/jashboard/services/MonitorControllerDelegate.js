(function(module) {
  jashboard = _.extend(module, {
    MonitorControllerDelegate: function(repository) {
      var findMonitorById = function(dashboards, id) {
        var monitor;
        for (var i = 0; i < dashboards.length; i++) {
          monitor = _.find(dashboards[i].monitors, function(monitor) {
            return id === monitor.id;
          });
          if (_.isObject(monitor)) {
            break;
          }
        };
        if (_.isUndefined(monitor)) {
          throw "Could not find monitor with id '" + id + "'";
        }
        return monitor;
      };

      this.updateMonitorRuntime = function(scope, monitor) {
        repository.loadMonitorRuntimeInfo(
          monitor.id,
          monitor.type,
          monitor.runtimeInfoSynchroniser(function() {
            scope.$apply();
          })
        );
      };

      this.init = function(scope) {
        var self = this;
        scope.$on("NewMonitorCreated", function(event, dashboard_id, monitor) {
          var dashboard = _.find(scope.dashboards, function(dashboard) {
            return (dashboard.id === dashboard_id);
          });
          dashboard.monitors.push(monitor);
          self.updateMonitorRuntime(scope, monitor);
          scope.$apply();
        });

        scope.$on("MonitorPositionChanged", function(event, monitorElement, monitorPosition) {
          var monitor = findMonitorById(scope.dashboards, monitorElement.getAttribute("id"));
          monitor.setPosition(monitorPosition);
          repository.updateMonitorPosition(monitor.id, monitorPosition);
        });
      }
    }
  });
  jashboard.services.service('MonitorControllerDelegate', ['Repository', jashboard.MonitorControllerDelegate]).run(function() {
    steal.dev.log("MonitorControllerDelegate initialized");
  });
}(jashboard || {}));
