jashboard.plugin.TypeAdapter = function() {
  var handlers = {};
  this.registerTypeHandler = function(type, handler) {
    if (!_.isUndefined(handlers[type])) {
      throw("Handler for type '" + type + "' is already registered");
    }
    handlers[type] = handler;
  };
  this.toObject = function(data) {
    if (_.isUndefined(data.type) || _.isUndefined(handlers[data.type])) {
      throw("Invalid type or handler not registered [" + data.type + "]");
    }
    return handlers[data.type](data);
  };
};
