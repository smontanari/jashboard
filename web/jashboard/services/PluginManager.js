(function(module) {
  jashboard = _.extend(module, {
    PluginManager: function() {
      var monitorTypeAdapters = {};

      this.addMonitorAdapter = function(typeIdentifier, adapterConstructor) {
        var validateAdapter = function(adapter) {
          var requiredMethods = [
            "parseMonitorConfigurationForm",
            "convertDataToRuntimeInfo",
            "defaultSize"
          ];
          _.each(requiredMethods, function(method) {
            if(!_.contains(_.functions(adapter), method)) {
              throw "Adapter for [" + typeIdentifier + "] does not implement a " + method + " method";
            };
          });
        };
        if(!_.isUndefined(monitorTypeAdapters[typeIdentifier])) {
          throw "Adapter for [" + typeIdentifier + "] already exists";      
        }
        var adapter = new adapterConstructor.prototype.constructor();
        validateAdapter(adapter);
        monitorTypeAdapters[typeIdentifier] = adapter;
        if (_.isFunction(adapter.init)) {
          adapter.init();
        }
        console.log("Added MonitorAdapter for [" + typeIdentifier + "]");
      };

      this.getAllMonitorTypes = function() {
        return _.keys(monitorTypeAdapters);
      };

      this.findMonitorAdapter = function(typeIdentifier) {
        var adapter = monitorTypeAdapters[typeIdentifier];
        if (_.isUndefined(adapter)) {
          throw "Adapter for monitor type [" + typeIdentifier + "] not found";
        }
        return adapter;
      };
    }
  });
}(jashboard ||{}));

(function(module) {
  jashboard.plugin = _.extend(module, {
    pluginManager: new jashboard.PluginManager()
  });
  jashboard.services.factory('PluginManager', function() {
    return jashboard.plugin.pluginManager;
  }).run(function($log) {
    $log.info("PluginManager initialized");
  });
}(jashboard.plugin ||{}));

