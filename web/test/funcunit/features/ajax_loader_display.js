funcunitHelper.testFeature("Ajax loader display", "delayed_response", function() {
  this.createTest("it shows the ajax loader until response completes", function() {
    F(".overlay-msg").visible("the overlay message is shown");
    F(".overlay-msg").invisible(2000, null, "the overlay message is hidden");
    F("#monitor_1 .monitor-title .monitor-icon-ajax-loader").visible("the ajax loader is shown");
    F("#monitor_2 .monitor-title .monitor-icon-ajax-loader").visible("the ajax loader is shown");
    F("#monitor_2 .monitor-title .monitor-icon-ajax-loader").invisible(2000, null, "the ajax loader is hidden after 2 second");
    F("#monitor_1 .monitor-title .monitor-icon-ajax-loader").invisible(1000, null, "the ajax loader is hidden after 1 seconds");
  });
});