funcunitHelper.testFeature("Refreshing monitor runtime information", "refresh_monitor_runtime", function() {
  test("should update the monitor runtime data", function() {
    S("#monitor_1 .monitor-title .monitor-icon-ajax-error").visible();
    featureHelper.verifyElementContent("#monitor_1", {
      '.monitor-title': "Epic build",
      '.build-time': "",
      '.build-duration': "",
      '.build-result': "",
      '.build-status': ""
    });

    S("#monitor_1 .monitor-bar .monitor-icon-refresh").visible().click();
    
    FuncUnit.wait(1500, function() {
      featureHelper.verifyElementContent("#monitor_1", {
        '.monitor-title': "Epic build",
        '.build-time': "23-08-2012 14:32:23",
        '.build-duration': "12:32",
        '.build-result': "success",
        '.build-status': "building"
      });
    });
  });
  test("should update the monitor runtime data at the given intervals", function() {
    S("#monitor_3 .monitor-title .monitor-icon-ajax-error").visible("should display an error icon");

    FuncUnit.wait(3500, function() {
      S("#monitor_3 .monitor-title .monitor-icon-ajax-error").invisible("should not display an error icon");
    });
    FuncUnit.wait(3500, function() {
      S("#monitor_3 .monitor-title .monitor-icon-ajax-error").visible("should display an error icon");
    });
  });
});