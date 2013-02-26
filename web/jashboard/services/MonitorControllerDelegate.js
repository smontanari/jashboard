(function(module) {
  jashboard = _.extend(module, {
    MonitorControllerDelegate: function(repository) {
      this.init = function(scope) {
        var self = this;
        scope.$on("NewMonitorCreated", function(event, monitor) {
          var dashboard = _.find(scope.dashboards, function(dashboard) {
            return (dashboard.id === event.targetScope.monitorForm.dashboard_id);
          });
          dashboard.monitors.push(monitor);
          scope.$apply();
        });

        scope.$on("MonitorPositionChanged", function(event, element, position) {
          var monitor = event.targetScope.monitor;
          monitor.setPosition(position);
          repository.updateMonitorPosition(monitor.id, position);
          event.stopPropagation();
        });

        scope.loadMonitorRuntimeInfo = function() {
          var self = this;
          var monitor = self.monitor;
          monitor.loadingStatus = jashboard.model.loadingStatus.waiting;
          repository.loadMonitorRuntimeInfo(
            monitor.id,
            monitor.type,
            {
              success: function(runtimeData) {
                monitor.runtimeInfo = runtimeData;
                monitor.loadingStatus = jashboard.model.loadingStatus.completed;
                delete scope.errorMessage;
                self.$apply();
              },
              error: function(status, error) {
                monitor.loadingStatus = jashboard.model.loadingStatus.error;
                self.errorMessage = "Error refreshing runtime information: " + status + " - " + error;
                self.$apply();
              }
            }
          );
        };
      }
    }
  });
  jashboard.services.service('MonitorControllerDelegate', ['Repository', jashboard.MonitorControllerDelegate]).run(function() {
    steal.dev.log("MonitorControllerDelegate initialized");
  });
}(jashboard || {}));
