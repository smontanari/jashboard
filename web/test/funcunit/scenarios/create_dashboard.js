steal("test/funcunit/scenarios/display_dashboards_data.js");

$.fixture("POST /dashboard", function(ajaxOriginalOptions, ajaxOptions, headers) {
  var response = [201, "success", {json: {id: "dashboard_4", name: "test new-dashboard", monitors: [] } }, {} ];

  return jashboard.test.validateAjaxRequest(ajaxOptions, response, function(data) {
    return (data.name === "test new-dashboard");
  });
});
