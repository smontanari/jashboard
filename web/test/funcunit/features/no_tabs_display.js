funcunitHelper.testFeature("No dashboards", "no_dashboard_data", function() {
  test("should display a message", function() {
    S(".no-data-available").visible(function() {
      ok(S(".no-data-available").text().match(/There are no configured dashboards\./));
    });
  });
});