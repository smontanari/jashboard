funcunitHelper.testFeature("Error handling: loading dashboards", "load_data_error", function() {
  this.createTest("it displays an error message", function() {
    F(".overlay-msg").invisible("does not display the ajax loader overlay");
    F(".data-load-error").visible(function() {
      ok(true, "displays the error message");
      ok(F(".data-load-error").text().match(/An error occurred while retrieving data from the server\./), "displays the error message");
    });
  });
});