var server = new scenarioHelper.SinonFakeServer();

server.fakeResponse("GET", "/ajax/dashboards", {
  content: [{
    "id": "dashboard_2", "name": "second dashboard",
    "monitors": [
      {
        "id": "monitor_2",
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
        "id": "monitor_3",
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
  timeout: 2000
});

server.fakeResponse("GET", "/ajax/monitor/monitor_2/runtime", {
  content: {
    type: "jenkins",
    last_build_time: "23-08-2012 14:32:23",
    duration: 752,
    success: true,
    status: 0
  },
  timeout: 4000
});

server.fakeResponse("GET", "/ajax/monitor/monitor_3/runtime", {
  content: {
    type: "go",
    last_build_time: "25-08-2012 15:56:45",
    duration: 126,
    success: false,
    status: 0
  },
  timeout: 2000
});
