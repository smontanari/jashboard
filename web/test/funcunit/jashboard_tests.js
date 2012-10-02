var jashboard = {
  test_utils: {
    openPageForTest: function(scenarioName) {
      S.open('index.html?test_scenario=' + scenarioName);
    }
  },
  functional_tests: []
};

steal("funcunit")
.then(
  "lib/underscore-min.js",
  "./dashboard_tabs_test.js",
  "./dashboard_monitors_test.js"
)
.then(function() {
  S.each(jashboard.functional_tests, function(index, test) {
    test();
  });
});
