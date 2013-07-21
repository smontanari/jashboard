(function() {
  var server = jashboard.test.getFakeServer();
  var dashboards = [];
  _.times(5, function(i) {
    dashboards.push({id: "test_" + (i+1), name: "dashboard_" + (i+1), monitors: []});
  });

  server.fakeResponse("GET", "/ajax/dashboards", {
    content: dashboards,
    delay: 1
  });
}());