funcunitHelper.testFeature("Monitor delete", "delete_monitor", function() {
  test("should delete the monitor", function() {
    S("#tab-dashboard_2").visible().click();
    S("#monitor_2 .monitor-icon-delete").visible().click();
    
    S("#alertConfirm").visible().click();

    S("#monitor_2").invisible("should not be displayed");
    S("#monitor_3").visible("should still be displayed");
  });
  test("should not delete the monitor", function() {
    S("#tab-dashboard_2").visible().click();
    S("#monitor_2 .monitor-icon-delete").visible().click();
    
    S("#alertCancel").visible().click();

    S("#monitor_2").visible("should still be displayed");
    S("#monitor_3").visible("should still be displayed");
  });
});
