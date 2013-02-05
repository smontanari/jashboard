funcunitHelper.testFeature("Dashboard create", "create_dashboard", function() {
  var openDashboardDialog = function() {
    S("#menuActions").click();
    S("#navbarMenu .menuAction-new-dashboard").visible("display new dashboard menu action link").click();
    S("#new-dashboard-form").visible("show new dashboard input dialog");
  };

  test("should create a new dashboard and display the new tab", function() {
    openDashboardDialog();
    var name = "test new-dashboard";
    funcunitHelper.inputText("input[name='dashboardName']", "test new-dashboard");

    S("#saveDashboard").visible().click();

    S(".dashboard-tab").size(4, function() {
      equal(S(".dashboard-tab").last().text().trim(), name, "dashboard name should be equal to " + name);    
    });
  });

  test("should reset the input fields on opening", function() {
    openDashboardDialog();
    funcunitHelper.inputText("input[name='dashboardName']", "some text");

    S("#cancelDashboard").visible().click();

    funcunitHelper.sleep(1);
    openDashboardDialog();
    S("input[name='dashboardName']").visible().text("");
  });

  test("should close the dialog on Cancel", function() {
    openDashboardDialog();
    S("#cancelDashboard").visible().click();
    S("#new-dashboard-form").invisible("should not be visible");
  });
});
