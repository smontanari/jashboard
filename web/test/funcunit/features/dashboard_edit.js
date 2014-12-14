funcunitHelper.testFeature("Edit an existing dashboard", "dashboard_actions", function() {
  this.createTest("should modify a current dashboard's name", function() {
    F("#tab-dashboard_1").visible(function() {
      equal(F("#tab-dashboard_1").text().trim(), "first dashboard", "dashboard name should be equal to " + name);
    });

    jashboardFeatureHelper.triggerDashboardAction("#dashboard_1", "edit");
    var name = "dashboard_new_name";
    pageHelper.inputText("dashboardName", name);

    F("#saveDashboard").visible().click();

    FuncUnit.wait(500, function() {
      F("#tab-dashboard_1").visible(function() {
        equal(F("#tab-dashboard_1").text().trim(), name, "dashboard name should be equal to " + name);
      });
    });
  });
});
