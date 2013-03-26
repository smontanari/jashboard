(function(module) {
  jashboard = _.extend(module, {
    ScopeValidationRulesBuilder: function() {
      var rules = [];
      // var evaluatePath = function(path) {
      //   return _.reduce(path.split("."), function(object, property) {
      //     if (_.isNull(object) || _.isUndefined(object)) {
      //       return null;
      //     }
      //     return object[property];
      //   }, scope);
      // };
      var validationRules = {
        required: function(value) {
          if (_.isEmpty(value)) {
            return {required: true};
          }
        },
        number: function(value) {
          if (!_.isEmpty(value) && !_.isFinite(parseInt(value, 10))) {
            return {number: "not a number"};
          }
        }
      };

      this.withRule = function(rule) {
        rules.push(rule);
        return this;
      };

      this.build = function() {
        return function(value) {
          var errors = {};
          _.each(rules, function(rule) {
            errors = _.extend(errors, validationRules[rule](value));
          });
          return errors;
        };
      };
    }
  });
}(jashboard || {}));
