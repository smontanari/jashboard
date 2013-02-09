funcunitHelper.testFeature("Ajax loader display", "delayed_response", function() {
  test("should show ajax loaders until ajax response completes", function() {
    S(".container > .waiting-msg").visible();
    S(".container > .waiting-msg").invisible();
    S("#monitor_1 .monitor-title img").visible();
    S("#monitor_2 .monitor-title img").visible();
    S("#monitor_2 .monitor-title img").invisible();
    S("#monitor_1 .monitor-title img").invisible();
  });
});