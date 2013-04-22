(function() {
  var server = jashboard.test.getFakeServer();

  server.fakeResponse("GET", /\/ajax\/monitor\/\w+\/runtime/, {
    content: {
      lastBuildTime: "2012-08-2012 14:32:23 +1000",
      duration: 752,
      success: true,
      status: 1
    }
  });
}());
