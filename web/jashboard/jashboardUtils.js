(function(module) {
  jashboard = _.extend(module, {
    formatTo2Digits: function(number) {
      if (number < 10) {
        return "0" + number;
      }
      return number.toString();
    },
    timeConverter: {
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
    },
    variableProcessor: {
      validateData: function(data, undefinedValue, convertFunction) {
        if (_.isUndefined(data)) return undefinedValue;
        if (_.isFunction(convertFunction)) return convertFunction(data);
        return data;
      }
    },
    stringUtils: {
      capitalise: function(s) {
        if (_.isString(s) && !_.isEmpty(s)) {
          return s.slice(0, 1).toUpperCase() + s.slice(1);
        }
      }
    },
    angularUtils: {
      safeApply: function(scope, expr) {
        var phase = scope.$root.$$phase;
        if(phase === '$apply' || phase === '$digest')
          scope.$eval(expr);
        else
          scope.$apply(expr);
      }
    }
  });
}(jashboard || {}));
