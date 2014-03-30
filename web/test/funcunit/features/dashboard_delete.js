funcunitHelper.testFeature("Delete a dashboard", "dashboard_actions", function() {
  this.createTest("should remove the dashboard tab and focus on the first available one", function() {
    F("#tab-dashboard_2").visible().click();
    jashboardFeatureHelper.triggerDashboardAction("#dashboard_2", "delete");

    jashboardFeatureHelper.confirmAlert();
    F("#tab-dashboard_2").size(0, "Dashboard tab for 'dashboard_2' should not exist");

    _.each(["dashboard_1", "dashboard_3"],function(tab_id) {
      F("#tab-" + tab_id).size(1, "Dashboard tab for '" + tab_id + "' should exist");
    });
    F("#dashboard_1 .dashboard-content").visible("dashboard_1 content should be visible");
  });
  this.createTest("should not remove the dashboard tab", function() {
    F("#tab-dashboard_2").visible().click();
    jashboardFeatureHelper.triggerDashboardAction("#dashboard_2", "delete");

    jashboardFeatureHelper.cancelAlert();
    F("#tab-dashboard_2").size(1, "Dashboard tab for 'dashboard_2' should still exist");

    S("#dashboard_2 .dashboard-content").visible("dashboard_2 content should be visible");
  });
});

