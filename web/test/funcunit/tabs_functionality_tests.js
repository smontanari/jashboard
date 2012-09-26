jashboard.functional_tests.push(function () {
  module("Tabs navigation",{
    //setup: function() {
    //}
	});

  test("should load dashboards data and display the navigation tabs", function() {
    var expectedTabs = ["first dashboard", "second dashboard", "another dashboard"];

    jashboard.test_utils.openPageForTest("display_dashboards_data");
    S("#dashboard-navbar ul li").size(expectedTabs.length, function() {
      S(this).each(function(index, element) {
        equal(S(element).visible().text(), expectedTabs[index], "tab text should match the tab name");
      });
    });
  });
});
