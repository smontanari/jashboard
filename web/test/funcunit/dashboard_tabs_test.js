jashboard.functional_tests.push(function () {
  module("Tabs functionality",{
    setup: function() {
      jashboard.test_utils.openPageForTest("display_dashboards_data");
    }
	});

  test("should load dashboards data and display the navigation tabs", function() {
    var expectedTabs = ["first dashboard", "second dashboard", "another dashboard"];
    S(".dashboard-tab").size(3, function() {
      S(this).each(function(index, element) {
        equal(S(element).text(), expectedTabs[index], "tab text should match the tab name");
      });
    });
  });
  test("should show the content of the corresponding dashboard when selecting a tab", function() {
    var expected_dashboard_ids = ["#dashboard_1", "#dashboard_2", "#dashboard_3"];
    _.each(expected_dashboard_ids, function(dashboard_id) {
      S(".dashboard-tab a[href='" + dashboard_id + "']").click();
      S(dashboard_id).visible("the content of " + dashboard_id + " is visible");
      _.each(_.without(expected_dashboard_ids, dashboard_id), function(id) {
        S(id).invisible("the content of " + id + " is not visible");
      });
    });
  });
});

