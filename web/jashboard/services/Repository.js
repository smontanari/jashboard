(function(module) {
  jashboard = _.extend(module, {
    Repository: function(http, modelMapper) {
      var AJAX_DASHBOARD = "/ajax/dashboard";
      var AJAX_MONITOR = "/ajax/monitor";
      var parseError = function(request) {
        if (_.isString(request.responseText)) {
          return request.responseText;
        }
      };
      var executeRequest = function(promise, handlers, dataMapperFn) {
        if(_.isFunction(handlers.success)) {
          promise.done(function(data) {
            if (_.isFunction(dataMapperFn)) {
              try {
                data = dataMapperFn(data);
              } catch (error) {
                if (_.isFunction(handlers.error)) {
                  handlers.error("Error mapping data", error);
                  throw error;
                }
              }
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
            return _.map(data, modelMapper.mapDataToDashboard);
          });
      };
      
      this.loadMonitorRuntimeInfo = function(monitor_id, monitorType, handlers) {
        executeRequest(
          http.getJSON(AJAX_MONITOR + "/" + monitor_id + "/runtime"), 
          handlers,
          function(data) {
            return modelMapper.mapDataToMonitorRuntimeInfo(monitorType, data);
          });
      };

      this.createDashboard = function(dashboardProperties, handlers) {
        executeRequest(
          http.postJSON(AJAX_DASHBOARD, dashboardProperties),
          handlers,
          function(data) {
            return modelMapper.mapDataToDashboard(data);
          });
      };

      this.updateDashboard = function(dashboardProperties, handlers) {
        executeRequest(
          http.putJSON(AJAX_DASHBOARD + "/" + dashboardProperties.id, _.omit(dashboardProperties, "id")),
          handlers
        );
      };

      this.createMonitor = function(dashboard_id, monitorModel, handlers) {
        executeRequest(
          http.postJSON(AJAX_DASHBOARD + "/" + dashboard_id + "/monitor", modelMapper.mapMonitorToData(monitorModel)),
          handlers,
          function(data) {
            return modelMapper.mapDataToMonitor(data);
          }
        );
      };

      this.updateMonitorConfiguration = function(monitorModel, handlers) {
        var monitorData = _.pick(modelMapper.mapMonitorToData(monitorModel), "name", "refreshInterval", "type", "configuration");
        executeRequest(
          http.putJSON(AJAX_MONITOR + "/" + monitorModel.id + "/configuration", monitorData),
          handlers
        );
      };

      this.updateMonitorPosition = function(monitor_id, position) {
        http.putJSON(AJAX_MONITOR + "/" + monitor_id + "/position", position);
      }

      this.updateMonitorSize = function(monitor_id, size) {
        http.putJSON(AJAX_MONITOR + "/" + monitor_id + "/size", size);
      }

      this.deleteDashboard = function(dashboard_id, handlers) {
        executeRequest(
          http.deleteResource(AJAX_DASHBOARD + "/" + dashboard_id),
          handlers
        );
      }

      this.deleteMonitor = function(dashboard_id, monitor_id, handlers) {
        executeRequest(
          http.deleteResource(AJAX_DASHBOARD + "/" + dashboard_id + "/monitor/" + monitor_id),
          handlers
        );
      }
    }
  });
  jashboard.services.service('Repository', ['HttpService', 'ModelMapper', jashboard.Repository]).run(function() {
    steal.dev.log("Repository initialized");
  });
}(jashboard || {}));
