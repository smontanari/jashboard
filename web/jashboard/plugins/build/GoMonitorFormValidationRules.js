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
      this.goPipeline = requiredRuleFor("pipeline");
      this.goStage = requiredRuleFor("stage");
      this.goJob = requiredRuleFor("job");
    }
  });
}(jashboard.plugin.build || {}));
