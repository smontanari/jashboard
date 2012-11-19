jashboard.functional_tests.push(function () {
  var openDashboardDialog = function() {
    S("#menuActions").click();
    S("#navbarMenu .menuAction-new-dashboard").visible("display new dashboard menu action link").click();
    S("#new-dashboard-form").visible("show new dashboard input dialog");
  };

  module("Feature: Dashboard create",{
    setup: function() {
      jashboard.test_utils.openPageForTestScenario("create_dashboard");
    }
	});

  test("should create a new dashboard and display the new tab", function() {
    openDashboardDialog();
    var name = "test new-dashboard";
    funcunitHelper.sleep(2);
    S("input[name='dashboardName']").visible().click().type(name);
    S("#saveDashboard").visible().click();
    S(".dashboard-tab").size(4);
    S(".dashboard-tab").last().text(name, "dashboard name should be equal to " + name);
  });

  test("should reset the input fields on opening", function() {
    openDashboardDialog();
    S("input[name='dashboardName']").visible().click().type("some text");
    S("#cancelDashboard").visible().click();
    funcunitHelper.sleep(2);
    openDashboardDialog();
    funcunitHelper.sleep(4);
    S("input[name='dashboardName']").visible().val("");
  });

  test("should close the dialog on Cancel", function() {
    openDashboardDialog();
    S("#cancelDashboard").visible().click();
    S("#new-dashboard-form").invisible("should not be visible");
  });

});
