define([
  "test/scenarios/two_dashboards_scenario",
  "test/scenarios/build_monitor_runtime_scenario"
], function() {
  smocker.scenario('dashboard_write_errors', function() {
    this.post("/ajax/dashboard").respondWith({
      status: 501,
      delay: 1
    });

    _.each(['put', 'delete'], function(method) {
      this[method](/^\/ajax\/dashboard\/(\w+)$/).respondWith({
        status: 500,
        delay: 1
      });
    }, this);
  });

  smocker.groupScenarios('dashboard_errors', ['two_dashboards', 'build_monitor_runtime', 'dashboard_write_errors']);
});