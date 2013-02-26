funcunitHelper.testFeature("Error handling: loading monitor runtime", "monitor_runtime_data_error", function() {
  test("should display a warning icon", function() {
    S("#monitor_1 .monitor-title .monitor-icon-ajax-loader").visible("the ajax loader is shown");
    S("#monitor_1 .monitor-title .monitor-icon-ajax-loader").invisible("the ajax loader is hidden");
    S("#monitor_1 .monitor-title .monitor-icon-ajax-error").visible("the ajax error is shown");
  });
});