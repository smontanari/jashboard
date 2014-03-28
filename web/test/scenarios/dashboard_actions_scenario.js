define(["test/scenarios/display_dashboards_data_scenario"], function() {
  smocker.scenario('dashboard_write_operations', function() {
    this.post('/ajax/dashboard').respondWith(function(url, requestData) {
      var data = JSON.parse(requestData);

      if ("test new-dashboard" === data.name) {
        return {
          status: 201,
          content: { id: "dashboard_4", name: "test new-dashboard", monitors: [] },
        };
      }
      throw "unexpected data in the POST request: " + requestData;
    });

    this.put('/ajax/dashboard/dashboard_1').respondWith(function(url, requestData) {
      var data = JSON.parse(requestData);

      if ("dashboard_new_name" === data.name) {
        return { status: 204 };
      }
      throw "unexpected data in the " + method + " request: " + requestData;
    });
    
    this.delete('/ajax/dashboard/dashboard_2').respondWith({ status: 204 });
  });

  smocker.groupScenarios('dashboard_actions', ['display_dashboards_data', 'dashboard_write_operations']);
});