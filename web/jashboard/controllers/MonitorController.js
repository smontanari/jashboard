(function(module) {
  jashboard = _.extend(module, {
    MonitorController: function(scope, repository, alertService, tooltipService) {
      scope.$on("MonitorPositionChanged", function(event, position) {
        var monitor = event.targetScope.monitor;
        monitor.position = position;
        repository.updateMonitorPosition(monitor.id, position);
        event.stopPropagation();
      });

      scope.$on("MonitorSizeChanged", function(event, size) {
        var monitor = event.targetScope.monitor;
        monitor.size = size;
        repository.updateMonitorSize(monitor.id, size);
        event.stopPropagation();
      });

      scope.removeMonitor = function() {
        var currentDashboard = this.dashboard;
        var currentMonitor = this.monitor;
        alertService.showAlert({
          title: "Remove monitor " + currentMonitor.name,
          message: "If you delete this monitor you will lose all its data. Continue?",
          confirmAction: function() {
            repository.deleteMonitor(currentMonitor.id, {
              success: function() {
                currentDashboard.monitors = _.without(currentDashboard.monitors, currentMonitor);
                scope.$apply();
              }
            });
          }
        });
      };

      scope.refreshRuntimeInfo = function() {
        var self = this;
        var monitor = self.monitor;
        monitor.loadingStatus = jashboard.model.loadingStatus.waiting;
        repository.loadMonitorRuntimeInfo(
          monitor.id,
          monitor.type,
          {
            success: function(data) {
              monitor.runtimeInfo = data;
              monitor.loadingStatus = jashboard.model.loadingStatus.completed;
              self.$apply();
              tooltipService.removeTooltip("error-" + monitor.id);
            },
            error: function(status, statusMessage, errorDetails) {
              monitor.loadingStatus = jashboard.model.loadingStatus.error;
              self.$apply();
              errorMessage = "Error refreshing runtime information - " +  statusMessage + 
                    " [" + errorDetails + "]";
              tooltipService.attachTooltip("error-" + monitor.id, errorMessage);
            }
          }
        );
      };
    }
  });
  jashboard.services.controller('MonitorController', ['$scope', 'Repository', 'AlertService', 'TooltipService', jashboard.MonitorController]).run(function() {
    steal.dev.log("MonitorController initialized");
  });
}(jashboard || {}));
