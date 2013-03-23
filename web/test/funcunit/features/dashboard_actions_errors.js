funcunitHelper.testFeature("Error handling: dashboard actions", "dashboard_errors", function() {
  var openDashboardDialog = function() {
    S("#menuActions").click();
    S("#navbarMenu .menuAction-new-dashboard").visible("display new dashboard menu action link").click();
    S("#new-dashboard-form").visible("show new dashboard input dialog");
  };

  test("should display an error overlay when failing to create a new dashboard", function() {
    FuncUnit.wait(1500, function() {
      openDashboardDialog();
      featureHelper.inputText("input[name='dashboardName']", "test new-dashboard");
    });

    S("#saveDashboard").visible().click();

    S(".overlay-msg.info").visible("display overlay while saving dashboard");
    S(".overlay-msg.info").text(/Saving dashboard/);

    S(".overlay-msg.alert.alert-error").visible("display error overlay");
    S(".overlay-msg").text(/an error occurred/);
  });

  test("should display an error overlay when failing to delete a dashboard", function() {
    S("#tab-dashboard_2").visible().click();
    S("#dashboard_2-actions").click();
    S("#dashboard_2 .dashboard-actions a:contains('Delete')").visible("display delete menu action").click();

    S("#alertConfirm").visible().click();

    S(".overlay-msg.info").visible("display overlay while deleting dashboard");
    S(".overlay-msg.info").text(/Deleting dashboard/);

    S(".overlay-msg.alert.alert-error").visible("display error overlay");
    S(".overlay-msg.alert.alert-error").text(/an error occurred/);
  });
});
