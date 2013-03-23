steal("test/funcunit/fixtures/fakeResponse_dashboards.js");
(function() {
  var server = jashboard.test.getFakeServer();

  server.fakeResponse("GET", "/ajax/monitor/monitor_1/runtime", {
    returnCode: 500,
    content: "something went very wrong",
    delay: 2
  });

  server.fakeResponse("GET", "/ajax/monitor/monitor_2/runtime", {
    content: {
      last_build_time: "25-08-2012 15:56:45",
      duration: 126,
      success: false,
      status: 0
    },
    delay: 1
  });
}());
