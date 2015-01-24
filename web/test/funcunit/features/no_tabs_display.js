funcunitHelper.testFeature("No dashboards", "no_dashboard_data", function() {
  this.createTest("it displays a message", function() {
    F(".no-data-available").visible(function() {
      ok(F(".no-data-available").text().match(/There are no configured dashboards\./));
    });
  });
});