(function(module) {
  jashboard = _.extend(module, {
    CreateMonitorWorkflow: function(scope, repository) {
      this.actions = ["next"];
      this.state = "showGenericConfiguration";

      this.next = function() {
        this.state = "showSpecificConfiguration";
        this.actions = ["back", "save"];
      };

      this.back = function() {
        this.state = "showGenericConfiguration";
        this.actions = ["next"];
      };

      this.save = function() {
        var dashboard_id = scope.monitorForm.dashboard_id;
        var monitorParameters = _.omit(scope.monitorForm, "dashboard_id");
        repository.createMonitor(dashboard_id, monitorParameters, function(monitor) {
          scope.$emit("NewMonitorCreated", dashboard_id, monitor);
          scope.$emit("CloseMonitorDialog", dashboard_id, monitor);
        });
      };
    }
  });
}(jashboard || {}));
