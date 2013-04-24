(function(module) {
  jashboard = _.extend(module, {
    MonitorController: function(rootScope, scope, repository, alertService, timeoutService) {
      var scheduleNextUpdate = function scheduleNextUpdate() {
        if (_.isFinite(scope.monitor.refreshInterval) && scope.monitor.refreshInterval > 0) {
          var interval = scope.monitor.refreshInterval * 1000;
          scope.monitor.runtimeUpdateScheduler = timeoutService(function() {
            updateMonitorRuntimeInfo(true);
          }, interval);
        }
      };
      var cancelUpdateSchedule = function() {
        if (_.isObject(scope.monitor.runtimeUpdateScheduler)) {
          timeoutService.cancel(scope.monitor.runtimeUpdateScheduler);
        }
      };
      var updateMonitorRuntimeInfo = function(scheduleNext) {
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
                scheduleNextUpdate();
              }
            },
            error: function(status, statusMessage, errorDetails) {
              monitor.loadingStatus = jashboard.model.loadingStatus.error;
              scope.errorMessage = "Error refreshing runtime information - " +  statusMessage;
              if (_.isString(errorDetails)) {
                scope.errorMessage += " [" + jashboard.stringUtils.ellipsis(errorDetails, 30) + "]";
              } 
              scope.$apply();
              if (scheduleNext) {
                scheduleNextUpdate();
              }
            }
          }
        );        
      };

      scope.$watch("monitor.configuration", function(newValue, oldValue) {
        if (newValue) {
          cancelUpdateSchedule();
          updateMonitorRuntimeInfo(true);
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

      scope.refreshRuntimeInfo = function() {
        updateMonitorRuntimeInfo(false);
      };
    }
  });
  jashboard.application.controller('MonitorController', [
    '$rootScope',
    '$scope',
    'Repository',
    'AlertService',
    '$timeout',
    jashboard.MonitorController]).run(function($log) {
    $log.info("MonitorController initialized");
  });
}(jashboard || {}));
