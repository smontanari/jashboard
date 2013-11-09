(function(module) {
  jashboard = _.extend(module, {
    PluginManager: function(logger) {
      var self = this;
      var instantiateAdapter = function(typeIdentifier) {
        var requiredMethods = [
          "parseMonitorConfigurationForm",
          "convertMonitorConfigurationToFormModel",
          "convertDataToRuntimeInfo",
          "defaultSize"
        ];

        if (_.isUndefined(jashboard.plugin[typeIdentifier])) {
          throw "namespace [jashboard.plugins." + typeIdentifier + "] not defined";
        }
        if (!_.isFunction(jashboard.plugin[typeIdentifier].MonitorAdapter)) {
          throw "Function [jashboard.plugins." + typeIdentifier + ".MonitorAdapter] not defined";
        }
        var adapter = new jashboard.plugin[typeIdentifier].MonitorAdapter();
        _.each(requiredMethods, function(method) {
          if(!_.contains(_.functions(adapter), method)) {
            throw "Adapter for [" + typeIdentifier + "] does not implement a " + method + " method";
          };
        });
        return adapter;
      };
      var registerMonitorAdapter = function(typeIdentifier) {
        if (_.isObject(self.monitorAdapters[typeIdentifier])) {
          logger.warn("MonitorAdapter for type [" + typeIdentifier + "] already defined");
        } else {
          try {
            self.monitorAdapters[typeIdentifier] = instantiateAdapter(typeIdentifier);
            logger.info("Registered MonitorAdapter for type [" + typeIdentifier + "]");
          } catch (error) {
            logger.warn(error);
          }
        }
      };

      this.monitorAdapters = {};
      _.each(jashboard.plugins, registerMonitorAdapter);
    }
  });
  jashboard.services.service("PluginManager", ['$log', jashboard.PluginManager])
  .run(['$log', function(log) {
    log.info("PluginManager initialized");
  }]);
}(jashboard ||{}));

