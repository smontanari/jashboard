define(['test/scenario_utils'], function() {
  var monitors = [], monitorRuntimeResponses = [];
  _.times(5, function(i) {
    monitors.push({
      id: "monitor_" + i,
      name: "Test build",
      refreshInterval: 30,
      type: "build",
      configuration: {
        type: "jenkins",
        hostname: "cibuild.host.com",
        port: 8080,
        buildId: "build_" + i
      }
    });
    monitorRuntimeResponses.push({
      id: "monitor_" + i,
      response: {
        content: {
          lastBuildTime: "2012-08-23 14:32:23 +1000",
          duration: jashboard.test.randomInt(300),
          success: jashboard.test.randomBoolean(),
          status: jashboard.test.randomInt(2)
        },
        delay: jashboard.test.randomInt(3)
      }
    });
  });

  smocker.scenario('demo_many_monitors', function() {
    this.get("/ajax/dashboards").respondWith({
      content: [
        { id: "dashboard_1", name: "a dashboard with many monitors", monitors: monitors }
      ]
    });

    this.get(/\/ajax\/monitor\/(\w+)\/runtime/).respondWith(function(url, data, headers, monitor_id) {
      var monitorRuntime = _.find(monitorRuntimeResponses, function(res) { return res.id === monitor_id });
      return monitorRuntime.response;
    });
  });
});