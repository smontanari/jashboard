jashboard.functional_tests.push(function () {
  module("Dashboard functionality",{
    setup: function() {
      jashboard.test_utils.openPageForTestScenario("create_dashboard");
    }
	});

  test("should create a new dashboard and display the new tab", function() {
    S(".menu-dashboard-new").click();
    S("#new-dashboard-form").visible("show new dashboard input dialog");
  });

});
