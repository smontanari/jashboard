jashboard.functional_tests.push(function () {
  module("Dashboard functionality",{
    setup: function() {
      jashboard.test_utils.openPageForTestScenario("create_dashboard");
    }
	});

  test("should create a new dashboard and display the new tab", function() {
    S("#menuActions").click();
    S("#menuAction-new-dashboard").visible("display new dashboard menu action link");
    S("#menuAction-new-dashboard").click();
    S("#form-new-dashboard").visible("show new dashboard input dialog");
  });

});
