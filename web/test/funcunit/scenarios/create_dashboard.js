steal("test/funcunit/scenarios/display_dashboards_data.js");

$.fixture("POST /dashboard", function(orig, settings, headers) {
  dashboard_json = settings.data;
  if (dashboard_json !== null) {
    if (dashboard_json.name === "test-new-dashboard") {
      return [201, "success", null, {Location: '/dashboard/dashboard_4'} ]
    }
  }
  throw("dashboard json data invalid: " + dashboard_json);
})
