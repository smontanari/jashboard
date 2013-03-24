(function(module) {
  jashboard = _.extend(module, {
    MonitorControllerDelegate: function(repository, alertService) {
      var updateMonitorRuntimeInfo = function(scope) {
        var monitor = scope.monitor;
        monitor.loadingStatus = jashboard.model.loadingStatus.waiting;
        repository.loadMonitorRuntimeInfo(
          monitor.id,
          monitor.type,
          {
            success: function(data) {
              monitor.runtimeInfo = data;
              monitor.loadingStatus = jashboard.model.loadingStatus.completed;
              scope.$apply();
            },
            error: function(status, statusMessage, errorDetails) {
              monitor.loadingStatus = jashboard.model.loadingStatus.error;
              scope.errorMessage = "Error refreshing runtime information - " +  statusMessage + 
                    " [" + errorDetails + "]";
              scope.$apply();
            }
          }
        );        
      };
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

        scope.loadRuntimeInfo = function() {
          if (_.isUndefined(this.monitor.loadingStatus)) {
            updateMonitorRuntimeInfo(this);
          }
        };

        scope.refreshRuntimeInfo = function() {
          updateMonitorRuntimeInfo(this);
        };
      };
    }
  });
  jashboard.services.service('MonitorControllerDelegate', ['Repository', 'AlertService', jashboard.MonitorControllerDelegate]).run(function() {
    steal.dev.log("MonitorControllerDelegate initialized");
  });
}(jashboard || {}));
