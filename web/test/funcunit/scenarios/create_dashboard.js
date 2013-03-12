steal("test/funcunit/scenarios/display_dashboards_data.js");

$.fixture("POST /ajax/dashboard", function(ajaxOriginalOptions, ajaxOptions, headers) {
  var data = JSON.parse(ajaxOptions.data);

  if ("test new-dashboard" === data.name) {
    return [201, "success", {json: {id: "dashboard_4", name: "test new-dashboard", monitors: [] } }, {} ];
  }
  throw "unexpected data in the POST request: " + ajaxOptions.data;
});
