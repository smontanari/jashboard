funcunitHelper.testFeature("Delete a dashboard", "delete_dashboard", function() {
  test("should remove the dashboard tab and focus on the first available one", function() {
    S("#tab-dashboard_2").visible().click();
    jashboardFeatureHelper.triggerDashboardAction("#dashboard_2", "delete");

    jashboardFeatureHelper.confirmAlert();
    S("#tab-dashboard_2").size(0, "Dashboard tab for 'dashboard_2' should not exist");

    _.each(["dashboard_1", "dashboard_3"],function(tab_id) {
      S("#tab-" + tab_id).size(1, "Dashboard tab for '" + tab_id + "' should exist");
    });
    S("#dashboard_1 .dashboard-content").visible("dashboard_1 content should be visible");
  });
  test("should not remove the dashboard tab", function() {
    S("#tab-dashboard_2").visible().click();
    jashboardFeatureHelper.triggerDashboardAction("#dashboard_2", "delete");

    jashboardFeatureHelper.cancelAlert();
    S("#tab-dashboard_2").size(1, "Dashboard tab for 'dashboard_2' should still exist");

    S("#dashboard_2 .dashboard-content").visible("dashboard_2 content should be visible");
  });
});

