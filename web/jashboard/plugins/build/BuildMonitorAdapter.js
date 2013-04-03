(function(module) {
  jashboard.plugin.build = _.extend(module, {
    BuildMonitorAdapter: function() {
      var buildDataConverter = new jashboard.plugin.TypeAdapter();
      var buildConfigurationConverter = new jashboard.plugin.TypeAdapter();
      var buildConfigurationFormParser = new jashboard.plugin.TypeAdapter();

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

      var extractBuildTypeProperties = function(object) {
        return _.omit(object, "hostname", "port")
      };

      this.convertDataToMonitorConfiguration = function(configurationData) {
        return _.extend({
          hostname: configurationData.hostname,
          port: configurationData.port
        }, buildDataConverter.toObject(extractBuildTypeProperties(configurationData)));
      };

      this.convertMonitorConfigurationToData = function(configurationModel) {
        return _.extend({
          hostname: configurationModel.hostname,
          port: configurationModel.port,
        }, buildConfigurationConverter.toObject(extractBuildTypeProperties(configurationModel)));
      };

      this.parseMonitorConfigurationForm = function(formModel) {
        return _.extend({
          hostname: formModel.hostname,
          port: parseInt(formModel.port, 10),
        }, buildConfigurationFormParser.toObject(extractBuildTypeProperties(formModel)));
      };

      this.convertDataToRuntimeInfo = function(runtimeInfo_data) {
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
        jashboard.plugin.build.buildDataConverter = buildDataConverter;
        jashboard.plugin.build.buildConfigurationConverter = buildConfigurationConverter;
        jashboard.plugin.build.buildConfigurationFormParser = buildConfigurationFormParser;
      };
    }
  });

  jashboard.plugin.pluginManager.addMonitorAdapter("build", jashboard.plugin.build.BuildMonitorAdapter);
}(jashboard.plugin.build || {}));
