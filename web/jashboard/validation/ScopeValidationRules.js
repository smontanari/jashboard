(function(module) {
  jashboard = _.extend(module, {
    ScopeValidationRules: function(scope) {
      var evaluatePath = function(path) {
        return _.reduce(path.split("."), function(object, property) {
          if (_.isNull(object) || _.isUndefined(object)) {
            return null;
          }
          return object[property];
        }, scope);
      };
      this.required = function(path) {
        return function() {
          if (_.isEmpty(evaluatePath(path))) {
            return {required: true};
          };
        }
      };
      this.number = function(path) {
        return function() {
          var value = evaluatePath(path);
          if (!_.isEmpty(value) && !_.isFinite(parseInt(value, 10))) {
            return {number: "not a number"};
          }
        };
      };
    }
  });
}(jashboard || {}));
