(function() {
  var server = jashboard.test.getFakeServer();
  var dashboards = [];
  for (i=1; i<=5; i++) {
    dashboards.push({id: "test_" + i, name: "dashboard_" + i, monitors: []});
  }

  server.fakeResponse("GET", "/ajax/dashboards", {
    content: dashboards,
    delay: 1
  });
}());