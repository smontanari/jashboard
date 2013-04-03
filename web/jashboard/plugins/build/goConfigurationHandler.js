(function() {
  _.each(['buildDataConverter', 'buildConfigurationConverter', 'buildConfigurationFormParser'], function(adapter) {
    jashboard.plugin.build[adapter].registerTypeHandler("go", _.clone);
  });
}());
