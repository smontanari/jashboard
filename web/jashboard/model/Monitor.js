jashboard.model.Monitor = function(monitorData) {
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

  var getServerSettings = function(settings) {
    switch(settings.type) {
      case 1: 
        return {
          server: "Jenkins",
          hostname: settings.hostname,
          port: settings.port,
          build_id: settings.build_id
        };
      case 2:
        return {
          server: "GO",
          hostname: settings.hostname,
          port: settings.port,
          pipeline: settings.pipeline,
          stage: settings.stage,
          job: settings.job
        };
      default:
        throw "Invalid CI server type: " + settings.type;
    }
  }

  var getBuildResult = function(result) {
    return result ? "success" : "failure";
  };

  this.id = monitorData.id;
  this.type = "build";
  this.title = monitorData.name;
  this.ciServerSettings = getServerSettings(monitorData.ciserver_settings);
  this.lastBuildTime = jashboard.variableProcessor.validateData(monitorData.runtime_info.last_build_time, "n/a");
  this.lastBuildDuration = jashboard.variableProcessor.validateData(monitorData.runtime_info.duration, "n/a", jashboard.timeConverter.secondsToTime);
  this.lastBuildSuccess = jashboard.variableProcessor.validateData(monitorData.runtime_info.success, "n/a");
  this.lastBuildResult = jashboard.variableProcessor.validateData(monitorData.runtime_info.success, "n/a", getBuildResult);
  this.currentBuildStatus = jashboard.variableProcessor.validateData(monitorData.runtime_info.status, "n/a", getBuildStatus);
};
