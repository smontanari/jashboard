(function(module) {
  jashboard.plugin.build = _.extend(module, {
    BuildMonitorAdapter: function() {
      var buildConfigurationParser = new jashboard.plugin.TypeAdapter();
      var buildConfigurationValidator = new jashboard.plugin.TypeAdapter();

      var getBuildStatus = function(status) {
        switch(status) {
          case 0:
            return "idle";
          case 1:
            return "building";
          default:
            return "n/a";
        }
      };

      var getBuildResult = function(result) {
        return result ? "success" : "failure";
      };

      this.parseConfiguration = function(configuration_data) {
        return buildConfigurationParser.toObject(configuration_data);    
      };

      this.getMonitorConfiguration = function(configuration_input) {
        return buildConfigurationValidator.toObject(configuration_input);    
      };

      this.parseRuntimeInfo = function(runtimeInfo_data) {
        return {
          lastBuildTime: jashboard.variableProcessor.validateData(runtimeInfo_data.last_build_time, "n/a"),
          lastBuildDuration: jashboard.variableProcessor.validateData(runtimeInfo_data.duration, "n/a", jashboard.timeConverter.secondsToTime),
          lastBuildSuccess: jashboard.variableProcessor.validateData(runtimeInfo_data.success, "n/a"),
          lastBuildResult: jashboard.variableProcessor.validateData(runtimeInfo_data.success, "n/a", getBuildResult),
          currentBuildStatus: jashboard.variableProcessor.validateData(runtimeInfo_data.status, "n/a", getBuildStatus)
        };    
      };

      this.defaultSize = function() {
        return {width: 240, height: 140};
      };

      this.init = function() {
        jashboard.plugin.build.buildConfigurationParser = buildConfigurationParser;
        jashboard.plugin.build.buildConfigurationValidator = buildConfigurationValidator;
      };
    }
  });

  jashboard.plugin.pluginManager.addMonitorAdapter("build", jashboard.plugin.build.BuildMonitorAdapter);
}(jashboard.plugin.build || {}));
