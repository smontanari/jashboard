jashboard.functional_tests.push(function () {
  module("Monitor create functionality",{
    setup: function() {
      jashboard.test_utils.openPageForTestScenario("create_monitor");
    }
	});

  test("should submit a request to create a new build monitor", function() {
    S("#dashboard_1-settings").click();
    S("#dashboard_1 .action-new-monitor").visible(function() {
      S(this).click();
    });
    S("#new-monitor-form").visible("show new monitor input dialog");
  });
});
