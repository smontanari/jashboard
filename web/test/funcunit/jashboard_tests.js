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
  "./dashboard_tabs_view_test.js",
  "./monitor_view_test.js",
  "./monitor_create_test.js"
)
.then(function() {
  S.each(jashboard.functional_tests, function(index, test) {
    test();
  });
});
