$.fixture("GET /ajax/dashboards", function(orig, settings, headers){
  return [[
    {
      'id': "dashboard_1", 'name': "my dashboard",
      'monitorData': []
    }
  ]];
});

$.fixture("POST /dashboard/dashboard_1/monitor", function(orig, settings, headers){
  return [201, "success", null, {Location: '/monitor/monitor_123'} ]
})
