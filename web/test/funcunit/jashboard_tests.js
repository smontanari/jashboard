var jashboard = {
  test_utils: {
    openPageForTest: function(scenarioName) {
      S.open('index.html?test_scenario=' + scenarioName);
    }
  },
  functional_tests: []
};

steal("funcunit")
.then("./tabs_functionality_tests.js")
.then(function() {
  S.each(jashboard.functional_tests, function(index, test) {
    test();
  });
});
