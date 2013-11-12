var funcunitHelper = {
  testFeature: function(description, scenario, testExecution) {
    jashboard.functionalTests.push(function () {
      module("Feature: " +  description, {
        setup: function() {
          S.open('index.html?test_scenario=' + scenario);
        }
      });
      testExecution();
    });
  }
};
