var jashboard = {
  test_utils: {
    openPageForTestScenario: function(scenarioName) {
      S.open('index.html?test_scenario=' + scenarioName);
    }
  },
  functional_tests: []
};

steal("funcunit", "lib/underscore-min.js")
.then(
  "./dashboard_tests.js",
  "./monitor_view_test.js",
  "./monitor_create_test.js",
  "./dashboard_tabs_view_test.js"
)
.then(function() {
  S.each(jashboard.functional_tests, function(index, test) {
    test();
  });
});
