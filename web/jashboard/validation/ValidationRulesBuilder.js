(function(module) {
  jashboard = _.extend(module, {
    ValidationRulesBuilder: function() {
      var rules = [];
      this.withRule = function(rule) {
        rules.push(rule);
        return this;
      };

      this.build = function() {
        return function(value) {
          var v = value;
          if (_.isString(value)) {
            v = value.trim();
          }
          var errors = {};
          _.each(rules, function(rule) {
            errors = _.extend(errors, rule(v));
          });
          return errors;
        };
      };
    }
  });
}(jashboard || {}));
