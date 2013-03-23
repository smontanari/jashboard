(function(module) {
  jashboard = _.extend(module, {
    MonitorControllerDelegate: function(repository, alertService) {
      this.init = function(scope) {
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
            confirmLabel: "Delete",
            confirmAction: function() {
              scope.$broadcast("MonitorDeleteStart");
              repository.deleteMonitor(currentDashboard.id, currentMonitor.id, {
                success: function() {
                  currentDashboard.monitors = _.without(currentDashboard.monitors, currentMonitor);
                  scope.$apply();
                  scope.$broadcast("MonitorDeleteComplete");
                },
                error: function() {
                  scope.$broadcast("AjaxError");
                }
              });
            }
          });
        };

        scope.refreshRuntimeInfo = function() {
          var self = this;
          var monitor = self.monitor;
          self.loadingStatus = jashboard.model.loadingStatus.waiting;
          repository.loadMonitorRuntimeInfo(
            monitor.id,
            monitor.type,
            {
              success: function(data) {
                monitor.runtimeInfo = data;
                self.loadingStatus = jashboard.model.loadingStatus.completed;
                self.$apply();
                self.$broadcast("MonitorRuntimeOk");
              },
              error: function(status, statusMessage, errorDetails) {
                self.loadingStatus = jashboard.model.loadingStatus.error;
                self.errorMessage = "Error refreshing runtime information - " +  statusMessage + 
                      " [" + errorDetails + "]";
                self.$apply();
                self.$broadcast("MonitorRuntimeError");
              }
            }
          );
        };
      };
    }
  });
  jashboard.services.service('MonitorControllerDelegate', ['Repository', 'AlertService', jashboard.MonitorControllerDelegate]).run(function() {
    steal.dev.log("MonitorControllerDelegate initialized");
  });
}(jashboard || {}));
