var FuncunitFeature = function(name, scenario) {
  this.name = name;
  this.scenario = scenario;
  this.testRuns = [];
  this.completed = false;
};
FuncunitFeature.prototype.scheduleAllTests = function() {
  var self = this;
  module("Feature: " +  this.name, {
    teardown: function() {
      self.completed = true;
    }
  });
  var self = this;
  _.each(this.testRuns, function(testRun) {
    test(testRun.description, function() {
      F.open('index.html?test_scenario=' + self.scenario);
      testRun.execute();
    });
  });
};
FuncunitFeature.prototype.createTest = function(description, fn) {
  this.testRuns.push({
    description: description,
    execute: fn
  });
};
var funcunitHelper = {
  testFeature: function(featureName, scenarioName, testDefinitions) {
    var feature = new FuncunitFeature(featureName, scenarioName);
    testDefinitions.call(feature);
    feature.scheduleAllTests();
    jashboard.testFeatures.push(feature);
  }
};
