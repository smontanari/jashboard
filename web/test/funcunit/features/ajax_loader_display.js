funcunitHelper.testFeature("Ajax loader display", "delayed_response", function() {
  test("should show ajax loaders until ajax response completes", function() {
    S(".overlay-msg").visible("the ajax loader message is shown");
    S(".overlay-msg").invisible(3000, null, "the ajax loader message is hidden");
    S("#monitor_1 .monitor-title .monitor-icon-ajax-loader").visible("the ajax loader is shown");
    S("#monitor_2 .monitor-title .monitor-icon-ajax-loader").visible("the ajax loader is shown");
    S("#monitor_2 .monitor-title .monitor-icon-ajax-loader").invisible(1500, null, "the ajax loader is hidden after 1 second");
    S("#monitor_1 .monitor-title .monitor-icon-ajax-loader").invisible(2500, null, "the ajax loader is hidden after 3 seconds");
  });
});