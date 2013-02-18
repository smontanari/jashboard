$.fixture("GET /ajax/dashboards", "//test/funcunit/fixtures/monitors_in_position.json");
$.fixture("GET /ajax/monitor/monitor_1/runtime", "//test/funcunit/fixtures/monitor_1.json");
$.fixture("GET /ajax/monitor/monitor_3/runtime", "//test/funcunit/fixtures/monitor_3.json");

$.fixture("PUT /ajax/monitor/monitor_1/position", function(ajaxOriginalOptions, ajaxOptions, headers) {
  var position = JSON.parse(ajaxOptions.data);
  if (position.top === 210 && position.left === 60) {
    return [201, "success", null, {} ];
  }
  throw "unexpected monitor position: " + position;
});
