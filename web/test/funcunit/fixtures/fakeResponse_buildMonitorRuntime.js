(function() {
  var server = jashboard.test.getFakeServer();

  server.fakeResponse("GET", /\/ajax\/monitor\/\w+\/runtime/, {
    content: {
      lastBuildTime: "23-08-2012 14:32:23",
      duration: 752,
      success: true,
      status: 1
    }
  });
}());
