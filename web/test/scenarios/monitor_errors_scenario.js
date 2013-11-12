steal("test/scenarios/two_dashboards_scenario.js");
(function() {
  smocker.scenario('monitor_common_operations', function() {
    this.get("/ajax/monitor/monitor_1/runtime").respondWith({
      status: 500,
      content: "something went very wrong",
      delay: 2
    });

    this.get("/ajax/monitor/monitor_3/runtime").respondWith({
      content: {
        lastBuildTime: "2012-08-25 15:56:45 +1000",
        duration: 126,
        success: false,
        status: 0
      },
      delay: 1
    });

    this.post(/^\/ajax\/dashboard\/(\w+)\/monitor$/).respondWith({
      status: 500,
      delay: 1
    });

    this.delete(/^\/ajax\/dashboard\/(\w+)\/monitor\/(\w+)$/).respondWith({
      status: 501,
      delay: 1
    });
  });

  smocker.groupScenarios('monitor_errors', ['two_dashboards', 'monitor_common_operations']);
})();
