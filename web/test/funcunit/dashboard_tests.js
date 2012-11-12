jashboard.functional_tests.push(function () {
  module("Dashboard functionality",{
    setup: function() {
      jashboard.test_utils.openPageForTestScenario("create_dashboard");
    }
    //teardown: function() {
      //S.win.close();
    //}
	});

  test("should create a new dashboard and display the new tab", function() {
    S("#menuActions").click();
    S("#menuAction-new-dashboard").visible("display new dashboard menu action link").click();
    S("#new-dashboard-form").visible("show new dashboard input dialog");
    S("#dashboardName").type("test new-dashboard");
    S("#saveDashboard").visible().click();
  });

});
