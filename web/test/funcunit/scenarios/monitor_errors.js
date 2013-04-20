steal("test/funcunit/fixtures/fakeResponse_dashboards.js");
(function() {
  var server = jashboard.test.getFakeServer();

  server.fakeResponse("GET", "/ajax/monitor/monitor_1/runtime", {
    returnCode: 500,
    content: "something went very wrong",
    delay: 2
  });

  server.fakeResponse("GET", "/ajax/monitor/monitor_3/runtime", {
    content: {
      last_builastBuildTimeld_time: "25-08-2012 15:56:45",
      duration: 126,
      success: false,
      status: 0
    },
    delay: 1
  });

  server.fakeResponse("POST", /^\/ajax\/dashboard\/(\w+)\/monitor$/, {
    returnCode: 500,
    delay: 1
  });
  server.fakeResponse("DELETE", /^\/ajax\/dashboard\/(\w+)\/monitor\/(\w+)$/, {
    returnCode: 501,
    delay: 1
  });  
}());
