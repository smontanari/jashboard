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

  this.id = monitorData.id;
  this.type = "build";
  this.title = monitorData.name;
  this.lastBuildTime = monitorData.runtime_info.last_build_time;
  this.lastBuildDuration = secondsToTime(monitorData.runtime_info.duration);
  this.lastBuildSuccess = monitorData.runtime_info.success;
  this.lastBuildResult = monitorData.runtime_info.success ? "success" : "failure";
  this.currentBuildStatus = convertStatus(monitorData.runtime_info.status);
};
