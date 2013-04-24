(function(module) {
  jashboard = _.extend(module, {
    FormValidator: function(form) {
      var validationRules = {};

      var validateForm = function() {
        form.isValid = _.all(_.keys(validationRules), function(inputName) {
          return _.isEmpty(validationRules[inputName]());
        });
      };

      this.applyRules = function(rules) {
        validationRules = _.extend(validationRules, rules);
        _.each(_.keys(rules), function(inputName) {
          form[inputName].$error = {};
        });
        validateForm();
      };
      this.validate = function(inputNames) {
        if (_.isArray(inputNames)) {
          _.each(inputNames, function(inputName) {
            form[inputName].$error = validationRules[inputName]() || {};
          });
        }
        validateForm();
      };
    }
  });
}(jashboard || {}));
