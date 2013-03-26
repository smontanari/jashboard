$.fixture("GET /ajax/dashboards", "//test/funcunit/fixtures/fixture_1_dashboard.json");
$.fixture("GET /ajax/monitor/monitor_1/runtime", "//test/funcunit/fixtures/fixture_build_monitor_1.json");
$.fixture("GET /ajax/monitor/monitor_2/runtime", "//test/funcunit/fixtures/fixture_build_monitor_2.json");

$.fixture("PUT /ajax/monitor/monitor_1/position", function(ajaxOriginalOptions, ajaxOptions, headers) {
  var data = JSON.parse(ajaxOptions.data);

  if (data.top === 210 && data.left === 60) {
    return [200, "success", {}, {} ];
  }
  throw "unexpected data in the POST request: " + ajaxOptions.data;
});

$.fixture("PUT /ajax/monitor/monitor_2/position", function(ajaxOriginalOptions, ajaxOptions, headers) {
  var data = JSON.parse(ajaxOptions.data);

  if (data.top === 0 && data.left === 200) {
    return [200, "success", {}, {} ];
  }
  throw "unexpected data in the POST request: " + ajaxOptions.data;
});

$.fixture("PUT /ajax/monitor/monitor_1/size", function(ajaxOriginalOptions, ajaxOptions, headers) {
  var data = JSON.parse(ajaxOptions.data);

  if (data.width === 295 && data.height === 340) {
    return [200, "success", {}, {} ];
  }
  throw "unexpected data in the POST request: " + ajaxOptions.data;
});

$.fixture("PUT /ajax/monitor/monitor_2/size", function(ajaxOriginalOptions, ajaxOptions, headers) {
  var data = JSON.parse(ajaxOptions.data);

  if (data.width === 270 && data.height === 350) {
    return [200, "success", {}, {} ];
  }
  throw "unexpected data in the POST request: " + ajaxOptions.data;
});

