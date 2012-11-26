steal("test/funcunit/scenarios/display_dashboards_data.js");

$.fixture("POST /dashboard", function(orig, settings, headers) {
  if (settings.data !== null) {
    dashboardParameters = JSON.parse(settings.data);
    if (dashboardParameters.name === "test new-dashboard") {
      return [201, "success", {json: {id: "dashboard_4", name: "test new-dashboard", monitors: [] } }, {} ]
    }
  }
  throw("invalid dashboard data in the POST request: " + settings.data);
});
