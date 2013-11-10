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
      },
      ellipsis: function(s, cutoff) {
        if (_.isUndefined(cutoff) || s.length <= cutoff) {
          return s;
        }
        return s.substring(0, cutoff) + "...";
      }
    },
    angularUtils: {
      safeApply: function(scope, expr) {
        var phase = scope.$root.$$phase;
        if(phase === '$apply' || phase === '$digest')
          scope.$eval(expr);
        else
          scope.$apply(expr);
      },
      mapEventActions: function(scope, eventsMap, actionsMap) {
        _.each(_.keys(eventsMap), function(actionName) {
          var events = eventsMap[actionName].split(',');
          _.each(events, function(eventName) {
            scope.$on(eventName, actionsMap[actionName]);
          });
        });
      }
    },
    functionUtils: {
      verify: function(testCondition) {
        return {
          then: function(fn) {
            if (testCondition) {
              fn();
            }
          }
        };
      },
      deferOnCondition: function(testFn, fn) {
        var self = this;
        return function() {
          self.verify(testFn()).then(fn);
        };
      }
    }
  });
}(jashboard || {}));
