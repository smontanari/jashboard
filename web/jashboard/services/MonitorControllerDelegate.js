(function(module) {
  jashboard = _.extend(module, {
    MonitorControllerDelegate: function(repository) {
      this.updateMonitorRuntime = function(scope, monitor) {
        repository.loadMonitorRuntimeInfo(
          monitor.id,
          monitor.type,
          monitor.runtimeInfoSynchroniser(function() {
            scope.$apply();
          })
        );
      };

      this.bindTo = function(scope) {
        var monitor = scope.monitor;
        repository.loadMonitorRuntimeInfo(
          monitor.id,
          monitor.type,
          monitor.runtimeInfoSynchroniser(function() {
            scope.$apply();
          })
        );
      }

      this.init = function(scope) {
        var self = this;
        scope.$on("NewMonitorCreated", function(event, monitor) {
          var dashboard = _.find(scope.dashboards, function(dashboard) {
            return (dashboard.id === event.targetScope.monitorForm.dashboard_id);
          });
          dashboard.monitors.push(monitor);
          self.updateMonitorRuntime(scope, monitor);
          scope.$apply();
        });

        scope.$on("MonitorPositionChanged", function(event, element, position) {
          var monitor = event.targetScope.monitor;
          monitor.setPosition(position);
          repository.updateMonitorPosition(monitor.id, position);
          event.stopPropagation();
        });
      }
    }
  });
  jashboard.services.service('MonitorControllerDelegate', ['Repository', jashboard.MonitorControllerDelegate]).run(function() {
    steal.dev.log("MonitorControllerDelegate initialized");
  });
}(jashboard || {}));
