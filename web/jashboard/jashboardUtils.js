jashboard.defineModule = function(namespaceDefinition, defineFunction) {
  var _defineNamespace = function(parent, namespace) {
    var ns = _.isEmpty(parent)? namespace : parent + "." + namespace;
    var theNamespace = eval(ns);
    if (_.isUndefined(theNamespace)) {
      eval(ns + " = {};");
    }
    return ns;
  };

  _.reduce(namespaceDefinition.split('.'), _defineNamespace, "");
  if (_.isFunction(defineFunction)) {
    defineFunction();
  }
};

jashboard.formatTo2Digits = function(number) {
  if (number < 10) {
    return "0" + number;
  }
  return number.toString();
};

jashboard.timeConverter = {
  secondsToTime: function(seconds) {
    var time = [];
    var secs = seconds % 60;
    var mins = ((seconds - secs) / 60) % 60;
    var hours = (seconds - secs - mins * 60) / 3600;
    if (hours > 0) {
      time.push(jashboard.formatTo2Digits(hours));
    }
    if (hours> 0 || mins > 0) {
      time.push(jashboard.formatTo2Digits(mins));
    }
    time.push(jashboard.formatTo2Digits(secs));
    return time.join(":");
  }
};

jashboard.variableProcessor = {
  validateData: function(data, undefinedValue, convertFunction) {
    if (_.isUndefined(data)) return undefinedValue;
    if (_.isFunction(convertFunction)) return convertFunction(data);
    return data;
  }
};
