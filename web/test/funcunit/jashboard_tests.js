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
  "./browser_close.js",
  "./dashboard_tests.js",
  "./monitor_tests.js",
  "./tabs_tests.js"
)
.then(function() {
  S.each(jashboard.functional_tests, function(index, test) {
    test();
  });
});
