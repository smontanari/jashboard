funcunitHelper.testFeature("Delete a monitor", "monitor_actions_scenario", function() {
  test("should delete the monitor", function() {
    S("#tab-dashboard_2").visible().click();
    jashboardFeatureHelper.triggerMonitorAction("#monitor_2", "delete");
    
    jashboardFeatureHelper.confirmAlert();

    S("#monitor_2").size(0, "monitor_2 should not exist");
    S("#monitor_3").size(1, "monitor_3 should still exist");
  });
  test("should not delete the monitor", function() {
    S("#tab-dashboard_2").visible().click();
    jashboardFeatureHelper.triggerMonitorAction("#monitor_2", "delete");
    
    jashboardFeatureHelper.cancelAlert();

    S("#monitor_2").visible("should still be displayed");
    S("#monitor_3").visible("should still be displayed");
  });
});
