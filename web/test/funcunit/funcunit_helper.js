var funcunitHelper = {
  testFeature: function(description, scenario, testExecution) {
    jashboard.functional_tests.push(function () {
      module("Feature: " +  description, {
        setup: function() {
          S.open('index.html?test_scenario=' + scenario);
        }
      });
      testExecution();
    });
  }
};
