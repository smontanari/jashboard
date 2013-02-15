jashboard.defineModule("jashboard.plugin", function() {
  jashboard.plugin.TypeAdapter = function() {
    var typeHandlers = {};
    
    this.registerTypeHandler = function(type, handler) {
      if (!_.isUndefined(typeHandlers[type])) {
        throw("Handler for type '" + type + "' is already registered");
      }
      typeHandlers[type] = handler;
    };

    this.getAllRegisteredTypes = function() {
      return _.keys(typeHandlers);
    };

    this.toObject = function(data) {
      if (_.isUndefined(data.type) || _.isUndefined(typeHandlers[data.type])) {
        throw("Invalid type or handler not registered [" + data.type + "]");
      }
      return typeHandlers[data.type](data);
    };
  };  
});
