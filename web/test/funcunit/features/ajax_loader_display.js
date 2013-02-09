funcunitHelper.testFeature("Ajax loader display", "delayed_response", function() {
  test("should show ajax loaders until ajax response completes", function() {
    S(".container > .waiting-msg").visible("the waiting message is shown");
    S(".container > .waiting-msg").invisible(2500, null, "the waiting message is hidden after 2 seconds");
    S("#monitor_1 .monitor-title img").visible("the ajax loader is shown");
    S("#monitor_2 .monitor-title img").visible("the ajax loader is shown");
    S("#monitor_2 .monitor-title img").invisible(1500, null, "the ajax loader is hidden after 1 second");
    S("#monitor_1 .monitor-title img").invisible(2500, null, "the ajax loader is hidden after 3 seconds");
  });
});