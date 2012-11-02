jashboard.model.Monitor = function(monitorData) {
  var formatTo2Digits = function(number) {
    if (number < 10) {
      return "0" + number;
    }
    return number.toString();
  };
  var secondsToTime = function(seconds) {
    var time = [];
    var secs = seconds % 60;
    var mins = ((seconds - secs) / 60) % 60;
    var hours = (seconds - secs - mins * 60) / 3600;
    if (hours > 0) {
      time.push(formatTo2Digits(hours));
    }
    if (hours> 0 || mins > 0) {
      time.push(formatTo2Digits(mins));
    }
    time.push(formatTo2Digits(secs));
    return time.join(":");
  };

  var convertStatus = function(status) {
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
          job: settings.job,
        };
      default:
        throw "Invalid CI server type: " + settings.type;
    }
  }

  var getBuildResult = function(result) {
    return result ? "success" : "failure";
  };

  var validateData = function(data, undefinedValue, convertFunction) {
    if (_.isUndefined(data)) return undefinedValue;
    if (_.isFunction(convertFunction)) return convertFunction(data);
    return data;
  }

  this.id = monitorData.id;
  this.type = "build";
  this.title = monitorData.name;
  this.ciServerSettings = getServerSettings(monitorData.ciserver_settings);
  this.lastBuildTime = validateData(monitorData.runtime_info.last_build_time, "n/a");
  this.lastBuildDuration = validateData(monitorData.runtime_info.duration, "n/a", secondsToTime);
  this.lastBuildSuccess = validateData(monitorData.runtime_info.success, "n/a");
  this.lastBuildResult = validateData(monitorData.runtime_info.success, "n/a", getBuildResult);
  this.currentBuildStatus = validateData(monitorData.runtime_info.status, "n/a", convertStatus);
};
