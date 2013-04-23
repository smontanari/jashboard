(function(module) {
  jashboard = _.extend(module, {
    Repository: function(http, pluginManager) {
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
            return _.map(data, function(dashboardData) {
              return _.tap(new jashboard.model.Dashboard(dashboardData), function(dashboard) {
                _.each(dashboardData.monitors, function(monitorData) {
                  dashboard.monitors.push(new jashboard.model.Monitor(monitorData));
                });
              });
            });
          });
      };
      
      this.loadMonitorRuntimeInfo = function(monitor_id, monitorType, handlers) {
        executeRequest(
          http.getJSON(AJAX_MONITOR + "/" + monitor_id + "/runtime"), 
          handlers,
          function(data) {
            var monitorAdapter = pluginManager.findMonitorAdapter(monitorType);
            return monitorAdapter.convertDataToRuntimeInfo(data);
          });
      };

      this.createDashboard = function(dashboardProperties, handlers) {
        executeRequest(
          http.postJSON(AJAX_DASHBOARD, dashboardProperties),
          handlers,
          function(data) {
            return new jashboard.model.Dashboard(data);
          }
        );
      };

      this.updateDashboard = function(dashboardProperties, handlers) {
        executeRequest(
          http.putJSON(AJAX_DASHBOARD + "/" + dashboardProperties.id, _.omit(dashboardProperties, "id")),
          handlers
        );
      };

      this.createMonitor = function(dashboard_id, monitor, handlers) {
        executeRequest(
          http.postJSON(AJAX_DASHBOARD + "/" + dashboard_id + "/monitor", monitor),
          handlers,
          function(data) {
            return new jashboard.model.Monitor(data);
          }
        );
      };

      this.updateMonitorConfiguration = function(monitor, handlers) {
        var monitorData = _.pick(monitor, "name", "refreshInterval", "type", "configuration");
        executeRequest(
          http.putJSON(AJAX_MONITOR + "/" + monitor.id + "/configuration", monitorData),
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
  jashboard.services.service('Repository', ['HttpService', 'PluginManager', jashboard.Repository]).run(function($log) {
    $log.info("Repository initialized");
  });
}(jashboard || {}));
