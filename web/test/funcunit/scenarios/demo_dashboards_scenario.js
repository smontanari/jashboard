(function() {
  var dashboardCounter = 0;
  smocker.scenario('demo_dashboards', function() {
    this.get("/ajax/dashboards").respondWith({
      content: [],
      delay: 1
    });

    this.post("/ajax/dashboard").respondWith(function(url, data, headers) {
      var data = JSON.parse(data);
      dashboardCounter++;
      return {
        content: {
          "id": "dashboard_" + dashboardCounter, "name": data.name, "monitors": [] 
        },
        delay: 1
      };
    });

    this.put(/^\/ajax\/dashboard\/(\w+)$/).respondWith(function(url, data, headers, dashboard_id) {
      steal.dev.log("dashboard[" + dashboard_id + "] updated");
      return {status: 204, delay: 1};
    });
    
    this.delete(/^\/ajax\/dashboard\/(\w+)$/).respondWith(function(url, data, headers, dashboard_id) {
      steal.dev.log("dashboard[" + dashboard_id + "] deleted");
      return {status: 204, delay: 1};
    });
  });
})();