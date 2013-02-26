(function() {
  var server = new jashboard.test.SinonFakeServer();

  server.fakeResponse("GET", "/ajax/dashboards", {
    content: [{
      "id": "dashboard_1", "name": "my dashboard",
      "monitors": [
        {
          "id": "monitor_1",
          "name": "Epic build",
          "refresh_interval": 15,
          "type": "build",
          "configuration": {
            "type": "go",
            "hostname": "epic-ci.test.com",
            "port": 81,
            "pipeline": "epic main",
            "stage": "epic build",
            "job": "unit-integration tests"
          }
        },
        {
          "id": "monitor_2",
          "name": "Forum build",
          "refresh_interval": 30,
          "type": "build",
          "configuration": {
            "type": "jenkins",
            "hostname": "cibuild.host.com",
            "port": 8080,
            "build_id": "forum_trunk"
          }
        }
      ],
    }],
    timeout: 2
  });

  server.fakeResponse("GET", "/ajax/monitor/monitor_1/runtime", {
    returnCode: 501,
    content: {
      error: "smoething went very wrong"
    },
    timeout: 3
  });

  server.fakeResponse("GET", "/ajax/monitor/monitor_2/runtime", {
    content: {
      last_build_time: "25-08-2012 15:56:45",
      duration: 126,
      success: false,
      status: 0
    },
    timeout: 1
  });
}());
