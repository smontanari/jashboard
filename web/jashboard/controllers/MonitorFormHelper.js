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
        currentForm = monitorForms.defaultForm;
        currentSubmitAction = 'next';
        this.actions = ["next"];
      };

      this.registerMonitorTypeForm = function(type, form) {
        monitorForms[type] = form;
      };

      this.isActionEnabled = function(action) {
        if (action === 'back') {
          return true;
        }
        return currentForm.isValid;
      };

      this.submitAction = function() {
        jashboard.functionUtils.verify(currentForm.isValid).then(this[currentSubmitAction].bind(this));
      };

      this.save = saveCallback;
    }
  });
}(jashboard || {}));
