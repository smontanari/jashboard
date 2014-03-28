define(["test/scenarios/two_dashboards_scenario"], function() {
  var successResponse = {
    content: {
      lastBuildTime: "2012-08-23 14:32:23 +1000",
      duration: 752,
      success: true,
      status: 1
    },
    delay: 0.5
  };

  var requestCounts = {monitor_1: 0, monitor_3: 0};

  smocker.scenario('load_monitor_data', function() {
    this.get(/\/ajax\/monitor\/(\w+)\/runtime/).respondWith(function(url, data, headers, monitor_id) {
      requestCounts[monitor_id]++;
      if (requestCounts[monitor_id] % 2 == 0) {
        return successResponse;
      } else {
        return {
          status: 500,
          content: "something went very wrong for monitor " + monitor_id,
          delay: 1
        };
      }
    });
  });

  smocker.groupScenarios('refresh_monitor_runtime', ['two_dashboards', 'load_monitor_data']);
});