(function(module) {
  jashboard = _.extend(module, {
    Repository: function(http, modelMapper) {
      var parseError = function(request) {
        if (_.isString(request.responseText)) {
          var content = JSON.parse(request.responseText);
          return content.errorDescription;
        }
      };
      var executeRequest = function(promise, handlers, dataMapperFn) {
        if(_.isFunction(handlers.success)) {
          promise.done(function(data) {
            if (_.isFunction(dataMapperFn)) {
              data = dataMapperFn(data);
            }
            handlers.success(data);
          });
        }
        if (_.isFunction(handlers.error)) {
          promise.fail(function(request, status, statusMessage) {
            handlers.error(status, statusMessage, parseError(request));
          });
        }
      };

      this.loadDashboards = function(handlers) {
        executeRequest(
          http.getJSON("/ajax/dashboards"),
          handlers,
          function(data) {
            return _.map(data, modelMapper.mapDashboard);
          });
      };
      
      this.loadMonitorRuntimeInfo = function(monitor_id, monitorType, handlers) {
        executeRequest(
          http.getJSON("/ajax/monitor/" + monitor_id + "/runtime"), 
          handlers,
          function(data) {
            return modelMapper.mapMonitorRuntimeInfo(monitorType, data);
          });
      };

      this.createDashboard = function(parameters, handlers) {
        executeRequest(
          http.postJSON("/ajax/dashboard", parameters),
          handlers,
          function(data) {
            return modelMapper.mapDashboard(data);
          });
      };

      this.createMonitor = function(dashboard_id, monitorParameters, handlers) {
        executeRequest(
          http.postJSON("/ajax/dashboard/" + dashboard_id + "/monitor", monitorParameters),
          handlers,
          function(data) {
            return modelMapper.mapMonitor(data);
          });
      };

      this.updateMonitorPosition = function(monitor_id, position) {
        http.putJSON("/ajax/monitor/" + monitor_id + "/position", position);
      }

      this.updateMonitorSize = function(monitor_id, size) {
        http.putJSON("/ajax/monitor/" + monitor_id + "/size", size);
      }

      this.deleteMonitor = function(monitor_id, handlers) {
        executeRequest(
          http.delete("/ajax/monitor/" + monitor_id),
          handlers
        );
      }
    }
  });
  jashboard.services.service('Repository', ['HttpService', 'ModelMapper', jashboard.Repository]).run(function() {
    steal.dev.log("Repository initialized");
  });
}(jashboard || {}));
