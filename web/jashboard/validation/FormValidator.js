(function(module) {
  jashboard = _.extend(module, {
    FormValidator: function(form, scope) {
      var validationRules = {};

      var validateForm = function() {
        form.isValid = _.all(_.keys(validationRules), function(inputName) {
          return _.isEmpty(validationRules[inputName](scope));
        });
      };
      var initForm = function(isNewForm) {
        form.$pristine = isNewForm;
        form.$dirty = !isNewForm;
      };
      var initFields = function(isNewForm, rules) {
        _.each(_.keys(rules), function(inputName) {
          form[inputName].$pristine = isNewForm;
          form[inputName].$dirty = !isNewForm;
          form[inputName].$error = {};
        });
      };
      this.applyRules = function(rules) {
        validationRules = _.extend(validationRules, rules);
        var createMode = scope.$editMode === jashboard.inputOptions.createMode;
        initForm(createMode);
        initFields(createMode, rules);
        validateForm();
      };
      this.validate = function(inputName) {
        if (_.isString(inputName)) {
          form[inputName].$error = validationRules[inputName](scope) || {};
        }
        validateForm();
      };
    }
  });
}(jashboard || {}));
