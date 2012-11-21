jashboard.plugin.BuildMonitorPlugin = function() {
  var settingsHandler = function(data) {
    return jashboard.types.buildSettingsTypeAdapter.toObject(data.settings);
  };
  var runtimeHandler = function(data) {
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

    return {
      lastBuildTime: jashboard.variableProcessor.validateData(data.last_build_time, "n/a"),
      lastBuildDuration: jashboard.variableProcessor.validateData(data.duration, "n/a", jashboard.timeConverter.secondsToTime),
      lastBuildSuccess: jashboard.variableProcessor.validateData(data.success, "n/a"),
      lastBuildResult: jashboard.variableProcessor.validateData(data.success, "n/a", getBuildResult),
      currentBuildStatus: jashboard.variableProcessor.validateData(data.status, "n/a", getBuildStatus)
    };
  };

  this.initialize = function() {
    jashboard.types.buildSettingsTypeAdapter = new jashboard.model.TypeAdapter();
    jashboard.types.monitorSettingsTypeAdapter.registerTypeHandler(1, settingsHandler);
    jashboard.types.monitorRuntimeTypeAdapter.registerTypeHandler(1, runtimeHandler);
  };
};

jashboard.plugin.pluginManager.addPlugin("BuildMonitorPlugin", jashboard.plugin.BuildMonitorPlugin);
