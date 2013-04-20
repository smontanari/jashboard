(function(module) {
  jashboard.plugin.ipsum = _.extend(module, {
    IpsumMonitorAdapter: function() {
      this.convertDataToMonitorConfiguration = _.identity;

      this.convertMonitorConfigurationToData = _.identity;

      this.parseMonitorConfigurationForm = function(configurationForm) {
        return {
          numberOfSentences: parseInt(configurationForm.numberOfSentences, 10),
          language: configurationForm.language
        };
      };

      this.convertDataToRuntimeInfo = _.clone;

      this.defaultSize = function() {
        return { width: 250, height: 150 };
      }
    }
  });

  jashboard.plugin.pluginManager.addMonitorAdapter("ipsum", jashboard.plugin.ipsum.IpsumMonitorAdapter);
}(jashboard.plugin.ipsum || {}));
