(function() {
  var server = jashboard.test.getFakeServer();

  server.fakeResponse("GET", "/ajax/dashboards", {
    content: [{
      id: "dashboard_1", name: "my dashboard",
      monitors: [
        {
          id: "monitor_1",
          name: "Epic build",
          refresh_interval: 15,
          type: "build",
          configuration: {
            type: "go",
            hostname: "epic-ci.test.com",
            port: 81,
            pipeline: "epic main",
            stage: "epic build",
            job: "unit-integration tests"
          }
        }
      ],
    }],
    delay: 1
  });

  var errorResponse = {
    returnCode: 500,
    content: "something went very wrong",
    delay: 2
  };
  var successResponse = {
    content: {
      last_build_time: "23-08-2012 14:32:23",
      duration: 752,
      success: true,
      status: 1
    },
    delay: 1
  };

  var requestCount = 0;
  server.fakeResponse("GET", "/ajax/monitor/monitor_1/runtime", function(request) {
    requestCount++;
    if (requestCount % 2 > 0) {
      return errorResponse;
    } else {
      return successResponse;
    }
  });
}());
