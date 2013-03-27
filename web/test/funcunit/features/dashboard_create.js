funcunitHelper.testFeature("Dashboard create", "create_dashboard", function() {
  var openDashboardDialog = function() {
    S("#menuActions").click();
    S("#navbarMenu .menuAction-new-dashboard").visible("display new dashboard menu action link").click();
    S("#new-dashboard-form").visible("show new dashboard input dialog");
  };

  test("should create a new dashboard and display the new tab", function() {
    openDashboardDialog();
    var name = "test new-dashboard";
    featureHelper.inputText("input[name='dashboardName']", name);

    S("#saveDashboard").visible().click();

    S(".dashboard-tab").size(4, function() {
      equal(S(".dashboard-tab").last().text().trim(), name, "dashboard name should be equal to " + name);    
    });
  });

  test("should reset the input fields on opening", function() {
    openDashboardDialog();
    featureHelper.inputText("input[name='dashboardName']", "some text");

    S("#cancelDashboard").visible().click();

    FuncUnit.wait(1000, function() {
      openDashboardDialog();
      S("input[name='dashboardName']").visible().text("");
    });
  });

  test("should close the dialog on Cancel", function() {
    openDashboardDialog();
    S("#cancelDashboard").visible().click();
    S("#new-dashboard-form").invisible("should not be visible");
  });

  test("should disable the 'Save' button if the dashboard name is empty", function() {
    openDashboardDialog();
    featureHelper.verifyElementDisabled("#saveDashboard");
  });

  test("should display a validation error and disable the 'Save' button if the dashboard name is cleared", function() {
    var expectedMessage = "You must provide a dashboard name.";
    openDashboardDialog();
    S("#dashboardNameRequiredError").invisible("should not display error");
    
    featureHelper.inputText("input[name='dashboardName']", "test name");
    
    FuncUnit.wait(500, function() {
      featureHelper.inputText("input[name='dashboardName']", "");
      S("#dashboardNameRequiredError").visible(function() {
        equal(S("#dashboardNameRequiredError").text().trim(), expectedMessage, "The error message is equal to " + expectedMessage);
      }, "should display error");
      featureHelper.verifyElementDisabled("#saveDashboard");
    });
  });
});
