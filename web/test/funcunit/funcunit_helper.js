var FuncunitFeature = function(name, scenario) {
  this.name = name;
  this.scenario = scenario;
  this.testRuns = [];
  this.completed = false;
};
FuncunitFeature.prototype.scheduleAllTests = function() {
  var self = this;
  module("Feature: " +  this.name, {
    setup: function() {
      F.open('index.html?smocker_scenario=' + self.scenario);
    },
    teardown: function() {
      self.completed = true;
    }
  });
  var self = this;
  _.each(this.testRuns, function(testRun) {
    test(testRun.description, function() {
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

F.speed = 10;

var funcunitHelper = {
  testFeature: function(featureName, scenarioName, testDefinitions) {
    var feature = new FuncunitFeature(featureName, scenarioName);
    testDefinitions.call(feature);
    feature.scheduleAllTests();
    jashboard.testFeatures.push(feature);
  }
};
