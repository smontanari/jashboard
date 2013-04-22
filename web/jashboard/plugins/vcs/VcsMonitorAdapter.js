(function(module) {
  jashboard.plugin.vcs = _.extend(module, {
    VcsMonitorAdapter: function() {
      this.parseMonitorConfigurationForm = function(formModel) {
        return {
          workingDirectory: formModel.workingDirectory,
          branch: formModel.branch,
          type: formModel.type,
          historyLength: parseInt(formModel.historyLength, 10),
          pagination: formModel.pagination,
          commitsPerPage: parseInt(formModel.commitsPerPage, 10)
        };
      };

      this.convertDataToRuntimeInfo = function(runtime_data) {
        return {commits: runtime_data};
      };

      this.defaultSize = function() {
        return {width: 520, height: 170};
      };
    }
  });

  jashboard.plugin.pluginManager.addMonitorAdapter("vcs", jashboard.plugin.vcs.VcsMonitorAdapter);
}(jashboard.plugin.vcs || {}));
