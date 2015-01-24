(function(module) {
  jashboard = _.extend(module, {
    MonitorScheduler: function(intervalService) {
      this.scheduleUpdate = function scheduleUpdate(monitor, callback) {
        if (_.isFinite(monitor.refreshInterval) && monitor.refreshInterval > 0) {
          var interval = monitor.refreshInterval * 1000;
          monitor.runtimeUpdateScheduler = intervalService(callback, interval);
        }
      };

      this.cancelUpdateSchedule = function(monitor) {
        if (_.isObject(monitor.runtimeUpdateScheduler)) {
          intervalService.cancel(monitor.runtimeUpdateScheduler);
        }
      };
    }
  });
  jashboard.services.service('MonitorScheduler', ['$interval', jashboard.MonitorScheduler])
  .run(['$log', function(log) {
    log.info("MonitorScheduler initialized");
  }]);
}(jashboard || {}));
