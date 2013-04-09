funcunitHelper.testFeature("Edit an existing dashboard", "dashboard_actions_scenario", function() {
  test("should modify a current dashboard's name", function() {
    S("#tab-dashboard_1").visible(function() {
      equal(S("#tab-dashboard_1").text().trim(), "first dashboard", "dashboard name should be equal to " + name);    
    });

    jashboardFeatureHelper.triggerDashboardAction("#dashboard_1", "edit");
    var name = "dashboard_new_name";
    pageHelper.inputText("input[name='dashboardName']", name);

    S("#saveDashboard").visible().click();

    FuncUnit.wait(500, function() {
      S("#tab-dashboard_1").visible(function() {
        equal(S("#tab-dashboard_1").text().trim(), name, "dashboard name should be equal to " + name);    
      });
    });
  });
});
