(function() {
  var server = jashboard.test.getFakeServer();

  server.fakeResponse("GET", "/ajax/dashboards", {
    content: [
      {
        id: "dashboard_1", name: "a dashboard",
        monitors: [
          {
            id: "monitor_1",
            name: "Epic build",
            refreshInterval: 15,
            position: {top: 10, left: 60},
            size: {width: 240, height: 140},
            type: "build",
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
            id: "monitor_3",
            name: "Forum build",
            refreshInterval: 2,
            position: {top: 10, left: 320},
            size: {width: 240, height: 140},
            type: "build",
            configuration: {
              type: "jenkins",
              hostname: "cibuild.host.com",
              port: 8080,
              buildId: "forum_trunk"
            }
          }
        ]
      },
      {
        id: "dashboard_2", name: "another dashboard",
        monitors: []
      }
    ],
    delay: 1
  });
}());