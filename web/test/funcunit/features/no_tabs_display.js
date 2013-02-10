funcunitHelper.testFeature("No dashboards", "no_data", function() {
  test("should display a message", function() {
    S(".no-dashboards").visible(function() {
      ok(S(".no-dashboards").text().match(/There are no configured dashboards\./));
    });
  });
});