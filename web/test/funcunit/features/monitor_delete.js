funcunitHelper.testFeature("Delete a monitor", "monitor_actions", function() {
  this.createTest("should delete the monitor", function() {
    F("#tab-dashboard_2").visible().click();
    jashboardFeatureHelper.triggerMonitorAction("#monitor_2", "delete");
    
    jashboardFeatureHelper.confirmAlert();

    F("#monitor_2").size(0, "monitor_2 should not exist");
    F("#monitor_3").size(1, "monitor_3 should still exist");
  });
  this.createTest("should not delete the monitor", function() {
    F("#tab-dashboard_2").visible().click();
    jashboardFeatureHelper.triggerMonitorAction("#monitor_2", "delete");
    
    jashboardFeatureHelper.cancelAlert();

    F("#monitor_2").visible("should still be displayed");
    F("#monitor_3").visible("should still be displayed");
  });
});
