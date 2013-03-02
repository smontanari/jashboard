funcunitHelper.testFeature("Error handling: loading monitor runtime", "monitor_runtime_data_error", function() {
  test("should display a warning icon", function() {
    S("#monitor_1 .monitor-title .monitor-icon-ajax-loader").visible("the ajax loader is shown");
    S("#monitor_1 .monitor-title .monitor-icon-ajax-loader").invisible("the ajax loader is hidden");
    S("#monitor_1 .monitor-title .monitor-icon-ajax-error").visible("the ajax error is shown");
  });
  test("should display a tooltip with an error description", function() {
    S("#monitor_1 .monitor-title .monitor-icon-ajax-error").visible(function() {
      S("#monitor_1 .monitor-title .monitor-icon-ajax-error").mouseover();
      S(".tooltip").visible(function() {
        ok(S(".tooltip").text().match(/something went very wrong/), "tooltip content should contain expected text");
      });
    });
  });
});