funcunitHelper.testFeature("Create a dashboard", "dashboard_actions", function() {
  this.createTest("it creates a new dashboard and display the new tab", function() {
    jashboardFeatureHelper.openDashboardDialog();
    var name = "test new-dashboard";
    pageHelper.inputText("dashboardName", name);

    F("#saveDashboard").visible().click();

    F(".dashboard-tab").size(4, function() {
      equal(F(".dashboard-tab").last().text().trim(), name, "dashboard name should be equal to " + name);
    });
  });

  this.createTest("it resets the input fields on opening", function() {
    jashboardFeatureHelper.openDashboardDialog();
    pageHelper.inputText("dashboardName", "some text");

    F("#cancelDashboard").visible().click();

    FuncUnit.wait(500, function() {
      jashboardFeatureHelper.openDashboardDialog();
      pageHelper.verifyInputValue("dashboardName", "", "should be blank");
    });
  });
});
