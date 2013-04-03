(function(module) {
  jashboard.plugin.ipsum = _.extend(module, {
    IpsumMonitorAdapter: function() {
      this.convertDataToMonitorConfiguration = function(configurationData) {
        return {
          numberOfSentences: configurationData.no_sentences,
          language: configurationData.language
        };
      };

      this.convertMonitorConfigurationToData = function(configuration) {
        return {
          no_sentences: parseInt(configuration.numberOfSentences, 10),
          language: configuration.language
        };
      };

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
