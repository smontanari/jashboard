jashboard.PluginManager = function() {
  var monitorTypeAdapters = {};

  this.addMonitorAdapter = function(typeIdentifier, adapterConstructor) {
    var validateAdapter = function(adapter) {
      _.each(["parseConfiguration", "parseRuntimeInfo"], function(method) {
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
    steal.dev.log("Added MonitorAdapter for [" + typeIdentifier + "]");
  };

  this.getAllMonitorTypes = function() {
    return _.keys(monitorTypeAdapters);
  };

  this.findMonitorAdapter = function(typeIdentifier) {
    return monitorTypeAdapters[typeIdentifier];
  };
};

jashboard.defineModule("jashboard.plugin", function() {
  jashboard.plugin.pluginManager = new jashboard.PluginManager();
  
  jashboard.services.factory('PluginManager', function() {
    return jashboard.plugin.pluginManager;
  }).run(function() {
    steal.dev.log("PluginManager initialized");
  });
});

