steal("test/funcunit/fixtures/fakeResponse_dashboards.js");
steal("test/funcunit/fixtures/fakeResponse_buildMonitorRuntime.js");
(function() {
  var server = jashboard.test.getFakeServer();

  server.fakeResponse("POST", "/ajax/dashboard", {
    returnCode: 501,
    delay: 1
  });
  server.fakeResponse("DELETE", /^\/ajax\/dashboard\/(\w+)$/, {
    returnCode: 500,
    delay: 1
  });
}());
