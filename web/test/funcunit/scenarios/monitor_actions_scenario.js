steal("test/funcunit/scenarios/display_dashboards_data.js");

$.fixture("DELETE /ajax/dashboard/dashboard_2/monitor/monitor_2", function(ajaxOriginalOptions, ajaxOptions, headers) {
  return [204, "success", {}, {} ];
});

$.fixture("PUT /ajax/monitor/monitor_1/configuration", function(ajaxOriginalOptions, ajaxOptions, headers) {
  var data = JSON.parse(ajaxOptions.data);
  console.log(data);
  if ("New Zombie build" === data.name && 20000 === data.refresh_interval) {
    return [204, "success", {}, {} ];
  }
  throw "unexpected data in the POST request: " + ajaxOptions.data;
});
