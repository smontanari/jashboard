(function(module) {
  jashboard = _.extend(module, {
    CreateMonitorWorkflow: function(saveCallback) {
      this.actions = ["next"];
      this.state = "showBaseConfiguration";

      this.next = function() {
        this.state = "showSelectedConfiguration";
        this.actions = ["back", "save"];
      };

      this.back = function() {
        this.state = "showBaseConfiguration";
        this.actions = ["next"];
      };

      this.save = saveCallback;
    }
  });
}(jashboard || {}));
