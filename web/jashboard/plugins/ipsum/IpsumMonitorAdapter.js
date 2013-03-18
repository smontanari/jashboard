(function(module) {
  jashboard.plugin.ipsum = _.extend(module, {
    IpsumMonitorAdapter: function() {
      this.parseConfiguration = function(configuration_data) {
        return {
          numberOfSentences: configuration_data.no_sentences,
          language: configuration_data.language
        };
      };

      this.validateConfiguration = function(configuration_data) {
        return {
          no_sentences: parseInt(configuration_data.numberOfSentences, 10),
          language: configuration_data.language
        };
      };

      this.parseRuntimeInfo = function(runtimeInfo_data) {
        return runtimeInfo_data;
      };

      this.defaultSize = function() {
        return {
          width: 300,
          height: 200
        }
      }
    }
  });

  jashboard.plugin.pluginManager.addMonitorAdapter("ipsum", jashboard.plugin.ipsum.IpsumMonitorAdapter);
}(jashboard.plugin.ipsum || {}));
