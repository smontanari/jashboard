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
      return configuration.build_id === "jenkins-build-123";
    } else if (configuration.type === "go") {
      return configuration.pipeline === "test-pipeline" &&
      configuration.stage === "test-stage" &&
      configuration.job === "test-job";
    }
  };
  var isExpectedData = function() {
    return (
      ajaxOptions.data.name === "Test " + ajaxOptions.data.configuration.type + "-monitor" &&
      ajaxOptions.data.refreshInterval === "30" &&
      ajaxOptions.data.type === "build" &&
      ajaxOptions.data.configuration.hostname === ajaxOptions.data.configuration.type + "-server" &&
      ajaxOptions.data.configuration.port === "1234" &&
      isExpectedConfiguration(ajaxOptions.data.configuration)
    );
  };
  // var data = JSON.parse(ajaxOptions.data);
  if (isExpectedData(ajaxOptions.data)) {
    return [
      201, 
      "success",
      scenarioHelper.monitorJsonResponseFixture("monitor_2", ajaxOptions.data),
      {} 
    ];
  }
  throw "unexpected data in the POST request: " + ajaxOptions.data;
});
