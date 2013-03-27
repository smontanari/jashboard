(function(module) {
  jashboard = _.extend(module, {
    FormValidator: function(validationRules) {
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
        form[inputName].$error = validationRules[inputName]() || {};
        validateForm();
      };
      this.inputInError = function(inputName) {
        return form[inputName].$dirty && !_.isEmpty(form[inputName].$error);
      };
    }
  });
}(jashboard || {}));
