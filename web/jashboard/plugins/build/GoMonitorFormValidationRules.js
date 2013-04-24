(function(module) {
  jashboard.plugin.build = _.extend(module, {
    GoMonitorFormValidationRules: function(scope) {
      var requiredRuleFor = function(property) {
        return function() {
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
