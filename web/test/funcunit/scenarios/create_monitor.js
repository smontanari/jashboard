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
  console.log(ajaxOptions.data);
  var response = [201, "success", {json: {
        "id": "monitor_2",
        "name": "test new-monitor",
        "refresh_interval": 10,
        "type": "build",
        "configuration": {
          "type": "go",
          "hostname": "test-dev.host.com",
          "port": 9080,
          "build_id": "zombie_build"
        }
      }
    }, {} ];

  return scenarioHelper.validateAjaxRequest(ajaxOptions, response, function(data) {
    return (data.name === "test new-monitor");
  });
});
