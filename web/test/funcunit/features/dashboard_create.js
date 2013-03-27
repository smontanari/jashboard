funcunitHelper.testFeature("Dashboard create", "create_dashboard", function() {
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

    FuncUnit.wait(1000, function() {
      jashboardFeatureHelper.openDashboardDialog();
      S("input[name='dashboardName']").visible().text("");
    });
  });

  test("should close the dialog on Cancel", function() {
    jashboardFeatureHelper.openDashboardDialog();
    S("#cancelDashboard").visible().click();
    S("#new-dashboard-form").invisible("should not be visible");
  });

  test("should disable the 'Save' button if the dashboard name is empty", function() {
    jashboardFeatureHelper.openDashboardDialog();
    pageHelper.verifyElementDisabled("#saveDashboard");
  });

  test("should display a validation error and disable the 'Save' button if the dashboard name is cleared", function() {
    var expectedMessage = "You must provide a dashboard name.";
    jashboardFeatureHelper.openDashboardDialog();
    S("#dashboardNameRequiredError").invisible("should not display error");
    
    pageHelper.inputText("input[name='dashboardName']", "test name");
    
    FuncUnit.wait(500, function() {
      pageHelper.inputText("input[name='dashboardName']", "");
      S("#dashboardNameRequiredError").visible(function() {
        equal(S("#dashboardNameRequiredError").text().trim(), expectedMessage, "The error message is equal to " + expectedMessage);
      }, "should display error");
      pageHelper.verifyElementDisabled("#saveDashboard");
    });
  });
});
