$.fixture("GET /ajax/dashboards", function(orig, settings, headers){
  return [[
    {
      'id': "dashboard_1", 'name': "my dashboard",
      "monitors": [
      {
        "id": "monitor_1",
        "name": "Zombie-Dash build",
        "refresh_interval": 10,
        "type": "build",
        "settings": {
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

$.fixture("POST /dashboard/dashboard_1/monitor", function(orig, settings, headers){
  return [201, "success", null, {Location: '/monitor/monitor_123'} ]
});
