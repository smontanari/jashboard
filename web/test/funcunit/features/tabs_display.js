funcunitHelper.testFeature("Tabs display", "display_dashboards_data", function() {
  this.createTest("it loads dashboards data and display the navigation tabs", function() {
    var expectedTabs = ["first dashboard", "second dashboard", "another dashboard"];
    F(".dashboard-tab").size(3, function() {
      F(this).each(function(index, element) {
        equal(F(element).text().trim(), expectedTabs[index], "tab text matches the tab name");
      });
    });
  });
  this.createTest("it shows the content of the corresponding dashboard when selecting a tab", function() {
    var expected_dashboard_ids = ["dashboard_1", "dashboard_2", "dashboard_3"];
    _.each(expected_dashboard_ids, function(dashboard_id) {
      F("#tab-" + dashboard_id).visible(function() {
        F(this).click();
        F("#" + dashboard_id).visible("the content of " + dashboard_id + " is visible");
        _.each(_.without(expected_dashboard_ids, dashboard_id), function(id) {
          F(id).invisible("the content of " + id + " is not visible");
        });
      });
    });
  });
});

