(function() {
  var regexp = /\?test_scenario=(\w+)/
  var match = regexp.exec(window.location.search);
  if (match) {
    var scenarioName = match[1];
    steal.dev.log("Loading test scenario: " + scenarioName);
    steal(
      'lib/sinon-1.7.3.js', 
      'bower_components/smocker/smocker.js',
      'test/funcunit/scenarios/test_scenario_utils.js'
    ).then("test/funcunit/scenarios/" + scenarioName + "_scenario.js").then(function() {
      smocker.play(scenarioName);
    });
  }
}());
