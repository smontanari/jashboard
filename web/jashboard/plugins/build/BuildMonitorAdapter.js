jashboard.defineNamespace("jashboard.plugin.build", function() {
  jashboard.plugin.build.BuildMonitorAdapter = function() {
    var buildConfigurationTypeAdapter = new jashboard.plugin.TypeAdapter();

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
      return buildConfigurationTypeAdapter.toObject(configuration_data);    
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

    this.init = function() {
      jashboard.plugin.build.buildConfigurationTypeAdapter = buildConfigurationTypeAdapter;
    };
  };

  jashboard.plugin.pluginManager.addMonitorAdapter("build", jashboard.plugin.build.BuildMonitorAdapter);
});