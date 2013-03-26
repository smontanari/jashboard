(function(module) {
  jashboard = _.extend(module, {
    ScopeValidationRules: function(scope) {
      this.required = function(modelName) {
        return function() {
          if (_.isEmpty(scope[modelName])) {
            return {required: true};
          };
        }
      }
    }
  });
}(jashboard || {}));
