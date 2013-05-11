(function() {
  var server = jashboard.test.getFakeServer();

  server.fakeResponse("GET", "/ajax/dashboards", {
    content: [{
      id: "dashboard_1", name: "my dashboard",
      monitors: [
        {
          id: "monitor_1",
          name: "Epic build",
          refreshInterval: 5000,
          type: "build",
          position: {top: 0, left: 0},
          size: {width: 240, height: 140},
          configuration: {
            type: "go",
            hostname: "epic-ci.test.com",
            port: 81,
            pipeline: "epic main",
            stage: "epic build",
            job: "unit-integration tests"
          }
        },
        {
          id: "monitor_2",
          name: "Forum build",
          refreshInterval: 10000,
          type: "build",
          position: {top: 0, left: 260},
          size: {width: 240, height: 140},
          configuration: {
            type: "jenkins",
            hostname: "cibuild.host.com",
            port: 8080,
            buildId: "forum_trunk"
          }
        }
      ],
    }],
    delay: 1.5
  });

  server.fakeResponse("GET", "/ajax/monitor/monitor_1/runtime", {
    content: {
      lastBuildTime: "2012-08-23 14:32:23 +1000",
      duration: 752,
      success: true,
      status: 1
    },
    delay: 2
  });

  server.fakeResponse("GET", "/ajax/monitor/monitor_2/runtime", {
    content: {
      lastBuildTime: "2012-08-25 15:56:45 +1000",
      duration: 126,
      success: false,
      status: 0
    },
    delay: 1
  });
}());
