(function() {
  var server = jashboard.test.getFakeServer();
  var monitors = [], monitorRuntimeResponses = [];
  for (i=1; i<5; i++) {
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
  }


  server.fakeResponse("GET", "/ajax/dashboards", {
    content: [
      { id: "dashboard_1", name: "a dashboard with many monitors", monitors: monitors }
    ]
  });
  
  server.fakeResponse("GET", /\/ajax\/monitor\/(\w+)\/runtime/, function(request, monitor_id) {
    var monitorRuntime = _.find(monitorRuntimeResponses, function(res) { return res.id === monitor_id });
    return monitorRuntime.response;
  });
}());