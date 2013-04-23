(function(module) {
  jashboard = _.extend(module, {
    MonitorFormHelper: function(initialForm, monitorModel, saveCallback) {
      var monitorForms = {
        defaultForm: initialForm
      };
      var currentForm = monitorForms.defaultForm;
      var currentSubmitAction = 'next';
      this.actions = ["next"];

      this.showForm = function(value) {
        return currentForm === monitorForms[value];
      };

      this.next = function() {
        this.actions = ["back", "save"];
        currentSubmitAction = 'save';
        currentForm = monitorForms[monitorModel.type];
      };

      this.back = function() {
        this.actions = ["next"];
        currentSubmitAction = 'next';
        currentForm = monitorForms.defaultForm;
      };

      this.registerMonitorTypeForm = function(type, form) {
        monitorForms[type] = form;
      }

      this.isActionEnabled = function(action) {
        if (action === 'back') {
          return true;
        }
        return currentForm.isValid;
      };

      this.submitAction = function() {
        if (this.isActionEnabled(currentSubmitAction)) {
          this[currentSubmitAction]();
        }
      };

      this.save = saveCallback;
    }
  });
}(jashboard || {}));
