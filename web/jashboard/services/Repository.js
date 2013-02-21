(function(module) {
  jashboard = _.extend(module, {
    Repository: function(http, modelMapper) {
      var executeRequest = function(promise, successHandler, errorHandler) {
        promise.done(successHandler)
        if (_.isFunction(errorHandler)) {
          promise.fail(function(request, status, error) {
            errorHandler(status, error);
          });
        }
      };

      this.loadDashboards = function(successHandler, errorHandler) {
        executeRequest(http.getJSON("/ajax/dashboards"), function(data) {
          successHandler(_.map(data, modelMapper.mapDashboard));
        }, errorHandler);
      };
      
      this.loadMonitorRuntimeInfo = function(monitor_id, monitorType, successHandler, errorHandler) {
        executeRequest(http.getJSON("/ajax/monitor/" + monitor_id + "/runtime"), function(data) {
          successHandler(modelMapper.mapMonitorRuntimeInfo(monitorType, data));
        }, errorHandler);
      };

      this.createDashboard = function(parameters, successHandler, errorHandler) {
        executeRequest(http.postJSON("/ajax/dashboard", parameters), function(data) {
          successHandler(modelMapper.mapDashboard(data));
        }, errorHandler);
      };

      this.createMonitor = function(dashboard_id, monitorParameters, successHandler, errorHandler) {
        executeRequest(http.postJSON("/ajax/dashboard/" + dashboard_id + "/monitor", monitorParameters), function(data) {
          successHandler(modelMapper.mapMonitor(data));
        }, errorHandler);
      };

      this.updateMonitorPosition = function(monitor_id, position) {
        http.putJSON("/ajax/monitor/" + monitor_id + "/position", position);
      }
    }
  });
  jashboard.services.service('Repository', ['HttpService', 'ModelMapper', jashboard.Repository]).run(function() {
    steal.dev.log("Repository initialized");
  });
}(jashboard || {}));
