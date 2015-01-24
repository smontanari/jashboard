funcunitHelper.testFeature("Refreshing monitor runtime information", "refresh_monitor_runtime", function() {
  this.createTest("it updates the monitor runtime data", function() {
    F("#monitor_1 .monitor-title .monitor-icon-ajax-error").visible();
    pageHelper.verifyElementContent("#monitor_1", {
      '.monitor-name': "Epic build",
      '.build-time': "",
      '.build-duration': "",
      '.build-result': "",
      '.build-status': ""
    });

    F("#monitor_1 .monitor-action.action-refresh").visible().click();

    FuncUnit.wait(1000, function() {
      pageHelper.verifyElementContent("#monitor_1", {
        '.monitor-name': "Epic build",
        '.build-time': "23-08-2012 14:32:23",
        '.build-duration': "12:32",
        '.build-result': "success",
        '.build-status': "building"
      });
    });
  });
  this.createTest("it updates the monitor runtime data at the given intervals", function() {
    F("#monitor_3 .monitor-title .monitor-icon-ajax-error").visible("displays an error icon");

    FuncUnit.wait(2500, function() {
      F("#monitor_3 .monitor-title .monitor-icon-ajax-error").invisible("does not display an error icon");
    });
    FuncUnit.wait(2500, function() {
      F("#monitor_3 .monitor-title .monitor-icon-ajax-error").visible("displays an error icon");
    });
  });
});