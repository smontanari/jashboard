(function(module) {
  jashboard.plugin.vcs = _.extend(module, {
    VcsMonitorAdapter: function() {
      this.convertDataToMonitorConfiguration = _.identity;

      this.convertMonitorConfigurationToData = _.identity;;

      this.parseMonitorConfigurationForm = function(formModel) {
        return {
          workingDirectory: formModel.workingDirectory,
          branch: formModel.branch,
          type: formModel.type,
          historyLength: parseInt(formModel.historyLength, 10),
          slideShowEffect: formModel.slideShowEffect,
          commitsPerPage: parseInt(formModel.commitsPerPage, 10)
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
