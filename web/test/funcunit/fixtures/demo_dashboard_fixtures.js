(function() {
  var server = jashboard.test.getFakeServer();
  var dashboardCounter = 0;

  server.fakeResponse("GET", "/ajax/dashboards", {
    content: [],
    delay: 1
  });

  server.fakeResponse("POST", "/ajax/dashboard", function(request) {
    var data = JSON.parse(request.requestBody);
    dashboardCounter++;
    return {
      content: {
        "id": "dashboard_" + dashboardCounter, "name": data.name, "monitors": [] 
      },
      delay: 1
    };
  });

  server.fakeResponse("DELETE", /\/ajax\/dashboard\/(\w+)/, function(request, dashboard_id) {
    steal.dev.log("dashboard[" + dashboard_id + "] deleted");
    return {returnCode: 204};
  });
}());