(function(module) {
  jashboard.plugin.build = _.extend(module, {
    MonitorAdapter: function() {
      var buildConfigurationFormParser = {};

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

      var getBuildDate = function(date) {
        return moment(date).format("DD-MM-YYYY HH:mm:ss");
      };

      var extractBuildTypeProperties = function(object) {
        return _.omit(object, "hostname", "port")
      };

      this.parseMonitorConfigurationForm = function(formModel) {
        return _.extend({
          hostname: formModel.hostname,
          port: parseInt(formModel.port, 10)
        }, buildConfigurationFormParser[formModel.type](extractBuildTypeProperties(formModel)));
      };

      this.convertDataToRuntimeInfo = function(runtimeInfo_data) {
        return {
          lastBuildTime: jashboard.variableProcessor.validateData(runtimeInfo_data.lastBuildTime, "n/a", getBuildDate),
          lastBuildDuration: jashboard.variableProcessor.validateData(runtimeInfo_data.duration, "n/a", jashboard.timeConverter.secondsToTime),
          lastBuildSuccess: jashboard.variableProcessor.validateData(runtimeInfo_data.success, "n/a"),
          lastBuildResult: jashboard.variableProcessor.validateData(runtimeInfo_data.success, "n/a", getBuildResult),
          currentBuildStatus: jashboard.variableProcessor.validateData(runtimeInfo_data.status, "n/a", getBuildStatus)
        };    
      };

      this.defaultSize = function() {
        return {width: 240, height: 140};
      };

      // this.init = function() {
      _.each(jashboard.plugin.build.buildTypes, function(type) {
        buildConfigurationFormParser[type] = jashboard.plugin.build[type].parseFormConfiguration;
      });
      // };
    }
  });
}(jashboard.plugin.build || {}));
