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
      var initForm = function(isNew) {
        form.$pristine = isNew;
        form.$dirty = !isNew;
        _.each(_.keys(validationRules), function(inputName) {
          form[inputName].$pristine = isNew;
          form[inputName].$dirty = !isNew;
          form[inputName].$error = {};
        });
      };
      this.prepareForm = function(inputForm, newForm) {
        form = inputForm;
        initForm(newForm || false);
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
