(function() {
  var regexp = /\?test_scenario=(\w+)/
  var match = regexp.exec(window.location.search);
  if (match) {
    var scenarioName = match[1];
    steal.dev.log("Loading test scenario: " + scenarioName);
    steal(
      { src: 'lib/sinon-1.5.2.js', ignore: true },
      { src: 'jquery/dom/fixture', ignore: true },
      // { src: 'test/funcunit/angular_test_helper.js', ignore: true },
      { src: 'test/funcunit/scenarios/scenario_helper.js', ignore: true }
    ).then("test/funcunit/scenarios/" + scenarioName + ".js");
  }
})();
