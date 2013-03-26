(function(module) {
  jashboard = _.extend(module, {
    FormValidator: function(form, fieldValidation) {
      var init = function() {
        form.$pristine = true;
        form.$dirty = false;
        _.each(_.keys(fieldValidation), function(inputName) {
          form[inputName].$pristine = true;
          form[inputName].$dirty = false;
          form[inputName].$error = {};
        });
        validateForm();
      };
      var validateForm = function() {
        form.isValid = _.all(_.keys(fieldValidation), function(inputName) {
          return _.isEmpty(fieldValidation[inputName]());
        });
      };
      this.onInputChange = function(inputName) {
        form[inputName].$error = fieldValidation[inputName]() || {};
        validateForm();
      };
      this.inputInError = function(inputName) {
        return form[inputName].$dirty && !_.isEmpty(form[inputName].$error);
      };

      init();
    }
  });
}(jashboard || {}));
