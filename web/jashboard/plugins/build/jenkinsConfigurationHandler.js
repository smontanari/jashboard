(function() {
  _.each(['buildDataConverter', 'buildConfigurationConverter', 'buildConfigurationFormParser'], function(adapter) {
    jashboard.plugin.build[adapter].registerTypeHandler("jenkins", _.identity);
  });
}());
