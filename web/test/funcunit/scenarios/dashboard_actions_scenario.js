steal("test/funcunit/scenarios/display_dashboards_data_scenario.js");

$.fixture("POST /ajax/dashboard", function(ajaxOriginalOptions, ajaxOptions, headers) {
  var data = JSON.parse(ajaxOptions.data);

  if ("test new-dashboard" === data.name) {
    return [201, "success", {json: {id: "dashboard_4", name: "test new-dashboard", monitors: [] } }, {} ];
  }
  throw "unexpected data in the POST request: " + ajaxOptions.data;
});

$.fixture("PUT /ajax/dashboard/dashboard_1", function(ajaxOriginalOptions, ajaxOptions, headers) {
  var data = JSON.parse(ajaxOptions.data);

  if ("dashboard_new_name" === data.name) {
    return [204, "success", {}, {} ];
  }
  throw "unexpected data in the POST request: " + ajaxOptions.data;
});

$.fixture("DELETE /ajax/dashboard/dashboard_2", function(ajaxOriginalOptions, ajaxOptions, headers) {
  return [204, "success", {}, {} ];
});
