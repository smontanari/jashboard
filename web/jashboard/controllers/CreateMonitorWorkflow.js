jashboard.defineNamespace("jashboard", function() {
  jashboard.CreateMonitorWorkflow = function(scope, repository) {
    scope.workflowActions = ["next"];
    scope.workflowState = "showGenericConfiguration";

    this.next = function() {
      scope.workflowState = "showSpecificConfiguration";
      scope.workflowActions = ["back", "save"];
    };

    this.back = function() {
      scope.workflowState = "showGenericConfiguration";
      scope.workflowActions = ["next"];
    };

    this.save = function() {
      var theScope = scope;
      repository.createMonitor(theScope.monitorForm, function(monitor) {
        theScope.$emit("NewMonitorCreated", monitor);
      });
    };
  };
});