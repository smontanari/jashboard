(function(module) {
  jashboard = _.extend(module, {
    MonitorController: function(rootScope, scope, repository, alertService, timeoutService) {
      var scheduleNextUpdate = function scheduleNextUpdate(scope) {
        if (_.isFinite(scope.monitor.refreshInterval) && scope.monitor.refreshInterval > 0) {
          var interval = scope.monitor.refreshInterval * 1000;
          scope.monitor.runtimeUpdateScheduler = timeoutService(function() {
            updateMonitorRuntimeInfo(scope, true);
          }, interval);
        }
      };
      var cancelUpdateSchedule = function() {
        if (_.isObject(scope.monitor.runtimeUpdateScheduler)) {
          timeoutService.cancel(scope.monitor.runtimeUpdateScheduler);
        }
      };
      var updateMonitorRuntimeInfo = function(scope, scheduleNext) {
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
              if (scheduleNext) {
                scheduleNextUpdate(scope);
              }
            },
            error: function(status, statusMessage, errorDetails) {
              monitor.loadingStatus = jashboard.model.loadingStatus.error;
              scope.errorMessage = "Error refreshing runtime information - " +  statusMessage + 
                    " [" + errorDetails + "]";
              scope.$apply();
              if (scheduleNext) {
                scheduleNextUpdate(scope);
              }
            }
          }
        );        
      };

      scope.$watch("monitor.refreshInterval", function(newValue, oldValue) {
        if (newValue !== oldValue) {
          if (_.isFinite(newValue) && !_.isFinite(oldValue)) {
            updateMonitorRuntimeInfo(scope, true);
          } else if (_.isFinite(oldValue) && !_.isFinite(newValue)) {
            cancelUpdateSchedule();
          }
        }
      });

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

      scope.editMonitor = function() {
        rootScope.$broadcast("OpenMonitorDialog", {
          mode: jashboard.inputOptions.updateMode,
          parameters: {
            monitor: scope.monitor
          }
        });
      };

      scope.removeMonitor = function() {
        var currentDashboard = scope.dashboard;
        var currentMonitor = scope.monitor;
        alertService.showAlert({
          title: "Remove monitor " + currentMonitor.name,
          message: "If you delete this monitor you will lose all its data. Continue?",
          confirmLabel: "Delete",
          confirmAction: function() {
            scope.$emit("MonitorDeleteStart");
            repository.deleteMonitor(currentDashboard.id, currentMonitor.id, {
              success: function() {
                currentDashboard.monitors = _.without(currentDashboard.monitors, currentMonitor);
                scope.$emit("MonitorDeleteComplete");
                scope.$apply();
                cancelUpdateSchedule();
              },
              error: function() {
                scope.$emit("AjaxError");
              }
            });
          }
        });
      };

      scope.loadRuntimeInfo = function() {
        if (_.isUndefined(scope.monitor.loadingStatus)) {
          updateMonitorRuntimeInfo(scope, true);
        }
      };

      scope.refreshRuntimeInfo = function() {
        updateMonitorRuntimeInfo(this, false);
      };
    }
  });
  jashboard.application.controller('MonitorController', [
    '$rootScope',
    '$scope',
    'Repository',
    'AlertService',
    '$timeout',
    jashboard.MonitorController]).run(function() {
    steal.dev.log("MonitorController initialized");
  });
}(jashboard || {}));
