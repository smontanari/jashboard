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
          "type": "go",
          "hostname": "zombie-dev.host.com",
          "port": 9080,
          "build_id": "zombie_build"
        }
      }]
    }
  ]];
});

$.fixture("GET /ajax/monitor/monitor_1/runtime", "//test/funcunit/fixtures/monitor_1.json");

$.fixture("POST /dashboard/dashboard_1/monitor", function(ajaxOriginalOptions, ajaxOptions, headers) {
  var monitorParams = JSON.parse(ajaxOptions.data);
  var response = [201, "success", {json: {
        "id": "monitor_2",
        "name": monitorParams.name,
        "refresh_interval": monitorParams.refreshInterval,
        "type": monitorParams.type,
        "configuration": {
          "type": monitorParams.configuration.type,
          "hostname": monitorParams.configuration.hostname,
          "port": monitorParams.configuration.port,
          "build_id": monitorParams.configuration.build_id
        }
      }
    }, {} ];

  return scenarioHelper.validateAjaxRequest(ajaxOptions, response, function(data) {
    return (
      data.name === "test new-monitor" &&
      data.refreshInterval === "30" &&
      data.type === "build" &&
      data.configuration.type === "jenkins" &&
      data.configuration.hostname === "test server-name" &&
      data.configuration.port === "1234" &&
      data.configuration.build_id === "jenkins-build-123"
    );
  });
});
