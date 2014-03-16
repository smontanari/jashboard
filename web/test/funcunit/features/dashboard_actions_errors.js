funcunitHelper.testFeature("Dashboard actions error handling", "dashboard_errors", function() {
  test("should display an error overlay when failing to create a dashboard", function() {
    jashboardFeatureHelper.openDashboardDialog();
    FuncUnit.wait(500, function() {
      pageHelper.inputText("dashboardName", "test new-dashboard");
    });

    S("#saveDashboard").visible().click();

    jashboardFeatureHelper.checkOverlayMessage(/Saving dashboard/);

    jashboardFeatureHelper.checkOverlayMessage(/an error occurred/, true);
  });

  test("should display an error overlay when failing to modify a dashboard", function() {
    jashboardFeatureHelper.triggerDashboardAction("#dashboard_1", "edit");

    pageHelper.inputText("dashboardName", "another dashboard");

    S("#saveDashboard").visible().click();

    jashboardFeatureHelper.checkOverlayMessage(/Saving dashboard/);
    jashboardFeatureHelper.checkOverlayMessage(/an error occurred/, true);

    FuncUnit.wait(500, function() {
      S("#tab-dashboard_1").visible(function() {
        equal(S("#tab-dashboard_1").text().trim(), "a dashboard", "dashboard name should be equal to " + "a dashboard");
      });
    });
  });

  test("should display an error overlay when failing to delete a dashboard", function() {
    S("#tab-dashboard_2").visible().click();
    jashboardFeatureHelper.triggerDashboardAction("#dashboard_2", "delete");

    S("#alertConfirm").visible().click();

    jashboardFeatureHelper.checkOverlayMessage(/Deleting dashboard/);

    jashboardFeatureHelper.checkOverlayMessage(/an error occurred/, true);

    S("#tab-dashboard_2").size(1, "Dashboard tab for 'dashboard_2' should still exist");
  });
});
