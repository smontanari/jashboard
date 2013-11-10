(function(module) {
  jashboard.plugin.ipsum = _.extend(module, {
    MonitorAdapter: function() {
      this.parseMonitorConfigurationForm = function(configurationForm) {
        return {
          numberOfSentences: parseInt(configurationForm.numberOfSentences, 10),
          language: configurationForm.language
        };
      };

      this.convertMonitorConfigurationToFormModel = _.clone;
      this.convertDataToRuntimeInfo = _.clone;

      this.defaultSize = function() {
        return { width: 250, height: 150 };
      };
    }
  });
}(jashboard.plugin.ipsum || {}));
