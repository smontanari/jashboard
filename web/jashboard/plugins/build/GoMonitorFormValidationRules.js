(function(module) {
  jashboard.plugin.build = _.extend(module, {
    GoMonitorFormValidationRules: function() {
      var requiredRuleFor = function(property) {
        return function(scope) {
          if (scope.monitorConfigurationFormModel.build.type === "go") {
            return jashboard.commonValidationRules.required(scope.monitorConfigurationFormModel.build[property]);
          }
        };
      };
      this.go_pipeline = requiredRuleFor("pipeline");
      this.go_stage = requiredRuleFor("stage");
      this.go_job = requiredRuleFor("job");
    }
  });
}(jashboard.plugin.build || {}));
