define(['bower_components/sinonjs/sinon', 'bower_components/smocker/smocker.min'], function() {
  var regexp = /\?test_scenario=(\w+)/;
  var match = regexp.exec(window.location.search);
  if (match) {
    var scenarioName = match[1];
    return function(callback) {
      console.warn("Loading test scenario: " + scenarioName);
      require(['test/scenarios/' + scenarioName + '_scenario'], function(scenario) {
        smocker.play(function() {
          this.get(/html\/.*/).forwardToServer();
        });
        smocker.play(scenarioName);
        callback();
      });
    };
  }
});
