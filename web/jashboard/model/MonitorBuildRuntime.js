jashboard.model.MonitorBuildRuntime = function(buildData) {
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

  this.lastBuildTime = jashboard.variableProcessor.validateData(buildData.last_build_time, "n/a");
  this.lastBuildDuration = jashboard.variableProcessor.validateData(buildData.duration, "n/a", jashboard.timeConverter.secondsToTime);
  this.lastBuildSuccess = jashboard.variableProcessor.validateData(buildData.success, "n/a");
  this.lastBuildResult = jashboard.variableProcessor.validateData(buildData.success, "n/a", getBuildResult);
  this.currentBuildStatus = jashboard.variableProcessor.validateData(buildData.status, "n/a", getBuildStatus);
};


