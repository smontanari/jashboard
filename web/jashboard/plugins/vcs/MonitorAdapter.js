(function(module) {
  jashboard.plugin.vcs = _.extend(module, {
    MonitorAdapter: function() {
      this.parseMonitorConfigurationForm = function(formModel) {
        return {
          workingDirectory: formModel.workingDirectory,
          branch: formModel.branch,
          type: formModel.type,
          historyLength: parseInt(formModel.historyLength, 10),
          pagination: formModel.pagination,
          commitsPerPage: parseInt(formModel.commitsPerPage, 10),
          interval: parseInt(formModel.interval, 10) * 1000
        };
      };

      this.convertMonitorConfigurationToFormModel = function(configuration) {
        return {
          workingDirectory: configuration.workingDirectory,
          branch: configuration.branch,
          type: configuration.type,
          historyLength: configuration.historyLength,
          pagination: configuration.pagination,
          commitsPerPage: configuration.commitsPerPage,
          interval: Math.floor(configuration.interval/1000)
        };
      };

      this.convertDataToRuntimeInfo = function(runtime_data) {
        return {commits: _.map(runtime_data, function(data) {
          return _.tap(_.pick(data, "revisionId", "author", "email", "message"), function(commit) {
            commit.date = jashboard.dependencies.moment(data.date, "YYYY-MM-DD HH:mm:ss ZZ").format("ddd MMM DD HH:mm:ss YYYY ZZ");
          });
        })};
      };

      this.defaultSize = function() {
        return {width: 520, height: 170};
      };
    }
  });
}(jashboard.plugin.vcs || {}));
