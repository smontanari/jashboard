funcunitHelper.testFeature("Create a dashboard", "dashboard_actions_scenario", function() {
  test("should create a new dashboard and display the new tab", function() {
    jashboardFeatureHelper.openDashboardDialog();
    var name = "test new-dashboard";
    pageHelper.inputText("input[name='dashboardName']", name);

    S("#saveDashboard").visible().click();

    S(".dashboard-tab").size(4, function() {
      equal(S(".dashboard-tab").last().text().trim(), name, "dashboard name should be equal to " + name);    
    });
  });

  test("should reset the input fields on opening", function() {
    jashboardFeatureHelper.openDashboardDialog();
    pageHelper.inputText("input[name='dashboardName']", "some text");

    S("#cancelDashboard").visible().click();

    FuncUnit.wait(500, function() {
      jashboardFeatureHelper.openDashboardDialog();
      S("input[name='dashboardName']").visible().text("");
    });
  });
});
