jashboard.defineNamespace("jashboard.model", function() {
  jashboard.model.CreateMonitorWorkflow = function() {
    this.actions = ["next"];
    this.displayState = "showGenericConfiguration";

    this.next = function() {
      this.displayState = "showSpecificConfiguration";
      this.actions = ["back", "save"];
    };

    this.back = function() {
      this.displayState = "showGenericConfiguration";
      this.actions = ["next"];
    };

  };
});