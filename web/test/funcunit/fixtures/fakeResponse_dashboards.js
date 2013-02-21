(function() {
  var server = jashboard.test.getFakeServer();

  server.fakeResponse("GET", "/ajax/dashboards", {
    content: [
      {
        "id": "dashboard_1", "name": "a dashboard",
        "monitors": [
          {
            "id": "monitor_1",
            "name": "Epic build",
            "refresh_interval": 15,
            "position": {"top": 10, "left": 60},
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
            "position": {"top": 200, "left": 400},
            "type": "build",
            "configuration": {
              "type": "jenkins",
              "hostname": "cibuild.host.com",
              "port": 8080,
              "build_id": "forum_trunk"
            }
          }
        ]
      }
    ]
  });
}());