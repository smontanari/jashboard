funcunitHelper.testFeature("Error handling: loading dashboards", "dashboard_data_error", function() {
  test("should display an error message", function() {
    S(".ajax-loader-msg").invisible("the ajax loader overlay should not be displayed");
    S(".global-ajax-error").visible(function() {
      ok(S(".global-ajax-error").text().match(/An error occurred while connecting to the server\./));
    });
  });
});