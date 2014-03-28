define(["test/scenarios/display_dashboards_data_scenario"], function() {
  smocker.scenario('monitor_write_operations', function() {
    this.delete('/ajax/dashboard/dashboard_2/monitor/monitor_2').respondWith({
      status: 204
    });

    this.put('/ajax/monitor/monitor_1/configuration').respondWith(function(url, requestData) {
      var data = JSON.parse(requestData);
      if ("New Zombie build" === data.name && 20000 === data.refreshInterval) {
        return [204, "success", {}, {} ];
      }
      throw "unexpected data in the POST request: " + requestData;
    });
  });

  smocker.groupScenarios('monitor_actions', ['monitor_write_operations', 'display_dashboards_data']);
});