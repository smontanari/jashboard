(function(module) {
  jashboard = _.extend(module, {
    MonitorFormHelper: function(initialForm, monitorModel, saveCallback) {
      var monitorForms = {
        defaultForm: initialForm
      };
      var currentForm = monitorForms.defaultForm;
      this.actions = ["next"];

      this.showForm = function(value) {
        return currentForm === monitorForms[value];
      };

      this.next = function() {
        this.actions = ["back", "save"];
        currentForm = monitorForms[monitorModel.type];
      };

      this.back = function() {
        this.actions = ["next"];
        currentForm = monitorForms.defaultForm;
      };

      this.registerMonitorTypeForm = function(type, form) {
        monitorForms[type] = form;
      }

      this.isActionEnabled = function(action) {
        if (action === 'back') {
          return true;
        }
        return currentForm.$dirty && currentForm.isValid;
      };

      this.save = saveCallback;
    }
  });
}(jashboard || {}));
