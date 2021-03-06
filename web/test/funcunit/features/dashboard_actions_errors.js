funcunitHelper.testFeature("Dashboard actions error handling", "dashboard_errors", function() {
  this.createTest("it displays an error overlay when failing to create a dashboard", function() {
    jashboardFeatureHelper.openDashboardDialog();
    FuncUnit.wait(500, function() {
      pageHelper.inputText("dashboardName", "test new-dashboard");
    });

    F("#saveDashboard").visible().click();

    jashboardFeatureHelper.checkOverlayMessage(/Saving dashboard/);

    jashboardFeatureHelper.checkOverlayMessage(/an error occurred/, true);
  });

  this.createTest("it displays an error overlay when failing to modify a dashboard", function() {
    jashboardFeatureHelper.triggerDashboardAction("#dashboard_1", "edit");

    pageHelper.inputText("dashboardName", "another dashboard");

    F("#saveDashboard").visible().click();

    jashboardFeatureHelper.checkOverlayMessage(/Saving dashboard/);
    jashboardFeatureHelper.checkOverlayMessage(/an error occurred/, true);

    FuncUnit.wait(500, function() {
      F("#tab-dashboard_1").visible(function() {
        equal(F("#tab-dashboard_1").text().trim(), "a dashboard", "dashboard name should be equal to " + "a dashboard");
      });
    });
  });

  this.createTest("it displays an error overlay when failing to delete a dashboard", function() {
    F("#tab-dashboard_2").visible().click();
    jashboardFeatureHelper.triggerDashboardAction("#dashboard_2", "delete");

    F("#alertConfirm").visible().click();

    jashboardFeatureHelper.checkOverlayMessage(/Deleting dashboard/);

    jashboardFeatureHelper.checkOverlayMessage(/an error occurred/, true);

    F("#tab-dashboard_2").size(1, "Dashboard tab for 'dashboard_2' should still exist");
  });
});
