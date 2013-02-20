(function() {
  var server = jashboard.test.getFakeServer();

  server.fakeResponse("PUT", /\/ajax\/monitor\/(\w+)\/position/, function(request, monitor_id) {
    var position = JSON.parse(request.requestBody);
    steal.dev.log("monitor[" + monitor_id + "] moved to [top: " + position.top + ", left: " + position.left + "]");
    return {returnCode: 201};
  });
}());
