jashboard.defineNamespace("jashboard.model", function() {
  jashboard.model.CreateMonitorWorkflow = function() {
    this.reset = function() {
      this.actions = ["next"];
      this.state = "showGenericConfiguration";
    };

    this.next = function() {
      this.state = "showSpecificConfiguration";
      this.actions = ["back", "save"];
    };

    this.back = function() {
      this.state = "showGenericConfiguration";
      this.actions = ["next"];
    };

    this.reset();
  };
});