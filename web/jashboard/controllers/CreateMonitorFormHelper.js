(function(module) {
  jashboard = _.extend(module, {
    CreateMonitorFormHelper: function(initialForm, monitorModel, saveCallback) {
      var monitorForms = {
        default: initialForm
      }
      var currentForm = monitorForms.default;
      this.actions = ["next"];
      this.state = "showBaseConfiguration";

      this.next = function() {
        this.state = "showSelectedConfiguration";
        this.actions = ["back", "save"];
        currentForm = monitorForms[monitorModel.type];
      };

      this.back = function() {
        this.state = "showBaseConfiguration";
        this.actions = ["next"];
        currentForm = monitorForms.default;
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
