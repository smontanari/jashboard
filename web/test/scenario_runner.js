(function() {
  var regexp = /\?test_scenario=(\w+)/
  var match = regexp.exec(window.location.search);
  if (match) {
    var scenarioName = match[1];
    steal.dev.warn("Loading test scenario: " + scenarioName);
    steal(
      'lib/sinon-1.7.3.js', 
      'bower_components/smocker/smocker.js',
      'jashboard/jashboard_loader.js',
      function() {
        steal("test/scenarios/" + scenarioName + "_scenario.js", function() {
          smocker.play(scenarioName);
        });
      }
    );
  }
}());
