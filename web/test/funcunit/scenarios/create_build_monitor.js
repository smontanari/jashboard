$.fixture("GET /ajax/dashboards", function(ajaxOptions, requestSettings, headers) {
  return [[
    {
      'id': "dashboard_1", 'name': "my dashboard",
      "monitors": [
      {
        "id": "monitor_1",
        "name": "Zombie-Dash build",
        "refresh_interval": 10,
        "type": "build",
        "configuration": {
          "type": "jenkins",
          "hostname": "zombie-dev.host.com",
          "port": 9080,
          "build_id": "zombie_build"
        }
      }]
    }
  ]];
});

_.each([1, 2, 3], function(index) {
  var monitor_id = "monitor_" + index;
  $.fixture("GET /ajax/monitor/" + monitor_id + "/runtime", "//test/funcunit/fixtures/" + monitor_id + ".json");
});

$.fixture("POST /dashboard/dashboard_1/monitor", function(ajaxOriginalOptions, ajaxOptions, headers) {
  var isExpectedConfiguration = function(configuration) {
    if (configuration.type === "jenkins") {
      return data.configuration.build_id === "jenkins-build-123";
    } else if (configuration.type === "go") {
      return data.configuration.pipeline === "test-pipeline" &&
      data.configuration.stage === "test-stage" &&
      data.configuration.job === "test-job";
    }
  };
  var isExpectedData = function() {
    return (
      data.name === "Test " + data.configuration.type + "-monitor" &&
      data.refreshInterval === "30" &&
      data.type === "build" &&
      data.configuration.hostname === data.configuration.type + "-server" &&
      data.configuration.port === "1234" &&
      isExpectedConfiguration(data.configuration)
    );
  };
  var data = JSON.parse(ajaxOptions.data);
  if (isExpectedData(data)) {
    return [
            201, 
            "success",
            scenarioHelper.monitorJsonResponseFixture("monitor_2", data),
            {} 
          ];
  }
  throw "unexpected data in the POST request: " + ajaxOptions.data;
});
