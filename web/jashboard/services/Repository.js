(function(module) {
  jashboard = _.extend(module, {
    Repository: function(http, modelMapper) {
      var parseError = function(request) {
        if (_.isString(request.responseText)) {
          var content = JSON.parse(request.responseText);
          return content.errorDescription;
        }
      };
      var executeRequest = function(promise, dataMapperFn, handlers) {
        if(_.isFunction(handlers.success)) {
          promise.done(function(data) {
            handlers.success(dataMapperFn(data));
          });
        }
        if (_.isFunction(handlers.error)) {
          promise.fail(function(request, status, statusMessage) {
            handlers.error(status, statusMessage, parseError(request));
          });
        }
      };

      this.loadDashboards = function(handlers) {
        executeRequest(http.getJSON("/ajax/dashboards"), function(data) {
          return _.map(data, modelMapper.mapDashboard);
        }, handlers);
      };
      
      this.loadMonitorRuntimeInfo = function(monitor_id, monitorType, handlers) {
        executeRequest(http.getJSON("/ajax/monitor/" + monitor_id + "/runtime"), function(data) {
          return modelMapper.mapMonitorRuntimeInfo(monitorType, data);
        }, handlers);
      };

      this.createDashboard = function(parameters, handlers) {
        executeRequest(http.postJSON("/ajax/dashboard", parameters), function(data) {
          return modelMapper.mapDashboard(data);
        }, handlers);
      };

      this.createMonitor = function(dashboard_id, monitorParameters, handlers) {
        executeRequest(http.postJSON("/ajax/dashboard/" + dashboard_id + "/monitor", monitorParameters), function(data) {
          return modelMapper.mapMonitor(data);
        }, handlers);
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
