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
    S("#navbarMenu .menuAction-new-dashboard").visible("display new dashboard menu action link").click();
    S("#new-dashboard-form").visible("show new dashboard input dialog");
    var name = "test new-dashboard";
    S("input[name='dashboardName']").visible().click().type(name);
    S("#saveDashboard").visible().click();
    S(".dashboard-tab").size(4);
    S(".dashboard-tab").last().text(name, "dashboard name should be equal to " + name);
  });

});
