funcunitHelper.testFeature("Delete a monitor", "monitor_actions", function() {
  this.createTest("it deletes the monitor", function() {
    F("#tab-dashboard_2").visible().click();
    jashboardFeatureHelper.triggerMonitorAction("#monitor_2", "delete");

    jashboardFeatureHelper.confirmAlert();

    F("#monitor_2").size(0, "monitor_2 does not exist");
    F("#monitor_3").size(1, "monitor_3 still exists");
  });
  this.createTest("it does not delete the monitor", function() {
    F("#tab-dashboard_2").visible().click();
    jashboardFeatureHelper.triggerMonitorAction("#monitor_2", "delete");

    jashboardFeatureHelper.cancelAlert();

    F("#monitor_2").visible("is still displayed");
    F("#monitor_3").visible("is still displayed");
  });
});
