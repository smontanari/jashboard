steal("test/funcunit/fixtures/fakeResponse_dashboards.js");
(function() {
  var server = jashboard.test.getFakeServer();

  var errorResponse = {
    returnCode: 500,
    content: "something went very wrong",
    delay: 1
  };
  var successResponse = {
    content: {
      lastBuildTime: "23-08-2012 14:32:23",
      duration: 752,
      success: true,
      status: 1
    },
    delay: 0.5
  };

  var requestCounts = {monitor_1: 0, monitor_3: 0};
  server.fakeResponse("GET", /\/ajax\/monitor\/(\w+)\/runtime/, function(request, monitor_id) {
    requestCounts[monitor_id]++;
    if (requestCounts[monitor_id] % 2 == 0) {
      return successResponse;
    } else {
      return errorResponse;
    }
  });
}());
