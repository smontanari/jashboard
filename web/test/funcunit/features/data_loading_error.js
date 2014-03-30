funcunitHelper.testFeature("Error handling: loading dashboards", "load_data_error", function() {
  this.createTest("should display an error message", function() {
    F(".overlay-msg").invisible("should not display the ajax loader overlay");
    F(".data-load-error").visible(function() {
      ok(true, "should display the error message");
      ok(F(".data-load-error").text().match(/An error occurred while retrieving data from the server\./), "should display the error message");
    });
  });
});