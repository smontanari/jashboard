(function() {
  var regexp = /\?test_scenario=(\w+)/
  var match = regexp.exec(window.location.search);
  if (match) {
    var scenarioName = match[1];
    steal.dev.log("Loading test scenario: " + scenarioName);
    steal(
      { src: 'jquery/dom/fixture', ignore: true },
      { src: 'test/funcunit/angular_test_helper.js', ignore: true },
      { src: 'test/funcunit/scenario_helper.js', ignore: true }
    ).then("test/funcunit/scenarios/" + scenarioName + ".js");
  }
})();
