(function(module) {
  jashboard.plugin.vcs = _.extend(module, {
    VcsMonitorAdapter: function() {
      this.convertDataToMonitorConfiguration = function(configurationData) {
        return {
          workingDirectory: configurationData.working_directory,
          branch: configurationData.branch,
          type: configurationData.type,
          historyLength: configurationData.history_length
        };
      };

      this.convertMonitorConfigurationToData = function(configurationModel) {
        return {
          working_directory: configurationModel.workingDirectory,
          type: configurationModel.type,
          branch: configurationModel.branch,
          history_length: configurationModel.historyLength
        };
      };

      this.parseMonitorConfigurationForm = function(formModel) {
        return {
          workingDirectory: formModel.workingDirectory,
          branch: formModel.branch,
          type: formModel.type,
          historyLength: parseInt(formModel.historyLength, 10)
        };
      };

      this.convertDataToRuntimeInfo = function(runtime_data) {
        return {commits: runtime_data};
      };

      this.defaultSize = function() {
        return {width: 500, height: 150};
      };
    }
  });

  jashboard.plugin.pluginManager.addMonitorAdapter("vcs", jashboard.plugin.vcs.VcsMonitorAdapter);
}(jashboard.plugin.vcs || {}));
