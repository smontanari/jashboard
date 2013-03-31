(function(module) {
  jashboard = _.extend(module, {
    FormValidator: function(rules) {
      var validationRules = rules;
      var form;

      var validateForm = function() {
        form.isValid = _.all(_.keys(validationRules), function(inputName) {
          return _.isEmpty(validationRules[inputName]());
        });
      };
      this.initForm = function(inputForm) {
        form = inputForm;
        form.$pristine = true;
        form.$dirty = false;
        _.each(_.keys(validationRules), function(inputName) {
          form[inputName].$pristine = true;
          form[inputName].$dirty = false;
          form[inputName].$error = {};
        });
        validateForm();
      };
      this.onInputChange = function(inputName) {
        if (_.isString(inputName)) {
          form[inputName].$error = validationRules[inputName]() || {};
        }
        validateForm();
      };
      this.inputInError = function(inputName) {
        if (!_.isUndefined(form)) {
          return form[inputName].$dirty && !_.isEmpty(form[inputName].$error);
        }
      };
    }
  });
}(jashboard || {}));
