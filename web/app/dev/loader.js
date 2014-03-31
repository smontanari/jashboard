define(['jashboard/jashboard-module', 'test/scenario_runner'], function(application, testRunner) {
  var runApplication = function() {
    if (_.isFunction(testRunner)) {
      testRunner(application.run);
    } else {
      application.run();
    }
  };
  return {
    run: function() {
      require(['app/dev/module_files', 'app/dev/plugin_files'], function(modules, plugins) {
        require(modules.concat(plugins), function() {
          require(['jashboard/services/PluginManager'], runApplication);
        });
      });
    }
  };
});