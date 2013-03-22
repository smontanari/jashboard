steal("test/funcunit/scenarios/display_dashboards_data.js");

$.fixture("DELETE /ajax/dashboard/dashboard_2", function(ajaxOriginalOptions, ajaxOptions, headers) {
  return [204, "success", {}, {} ];
});
