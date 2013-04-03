(function(module) {
  jashboard = _.extend(module, {
    FormValidator: function() {
      var validationRules;
      var form;

      var validateForm = function() {
        form.isValid = _.all(_.keys(validationRules), function(inputName) {
          return _.isEmpty(validationRules[inputName]());
        });
      };
      var init = function(inputForm, rules, isNewForm) {
        form = inputForm;
        validationRules = rules;
        form.$pristine = isNewForm;
        form.$dirty = !isNewForm;
        _.each(_.keys(validationRules), function(inputName) {
          form[inputName].$pristine = isNewForm;
          form[inputName].$dirty = !isNewForm;
          form[inputName].$error = {};
        });
        validateForm();
      };
      this.prepareFormForCreate = function(inputForm, rules) {
        init(inputForm, rules, true);
      };
      this.prepareFormForUpdate = function(inputForm, rules) {
        init(inputForm, rules, false);
      };
      this.triggerValidation = function(inputName) {
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
