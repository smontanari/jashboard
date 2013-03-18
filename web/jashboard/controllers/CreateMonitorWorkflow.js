(function(module) {
  jashboard = _.extend(module, {
    CreateMonitorWorkflow: function(saveCallback) {
      this.actions = ["next"];
      this.state = "showGenericConfiguration";

      this.next = function() {
        this.state = "showSelectedConfiguration";
        this.actions = ["back", "save"];
      };

      this.back = function() {
        this.state = "showGenericConfiguration";
        this.actions = ["next"];
      };

      this.save = saveCallback;
    }
  });
}(jashboard || {}));
