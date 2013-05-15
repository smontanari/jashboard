(function(module) {
  jashboard.plugin.build = _.extend(module, {
    go: {
      parseFormConfiguration: function(formModel) {
        return _.extend(formModel, {
          job: _.isEmpty(formModel.job) ? null : formModel.job
        });
      }, 
      convertMonitorConfigurationToFormModel: _.clone
    }
  });
}(jashboard.plugin.build || {}));
