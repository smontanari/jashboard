(function() {
  var regexp = /\?test_scenario=(\w+)/
  var match = regexp.exec(window.location.search);
  if (match) {
    var scenarioName = match[1];
    steal.dev.log("Loading test scenario: " + scenarioName);
    steal(
      { src: 'jquery/dom/fixture', ignore: true }
    ).then("test/funcunit/scenarios/" + scenarioName + ".js");
  }
})();
