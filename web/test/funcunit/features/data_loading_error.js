funcunitHelper.testFeature("Error handling: loading dashboards", "load_data_error", function() {
  test("should display an error message", function() {
    S(".overlay-msg").invisible("should not display the ajax loader overlay");
    S(".data-load-error").visible(function() {
      ok(S(".data-load-error").text().match(/An error occurred while retrieving data from the server\./), "should display the error message");
    });
  });
});