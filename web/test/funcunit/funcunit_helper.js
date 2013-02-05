var funcunitHelper = {
  sleeper: new function() {
    var sleepCount = 0;
    var sleep = function(id, seconds) {
      setTimeout(function() {
        S('body').append('<div id="sleep' + id +'" style="display: none"></div>');
      }, seconds * 1000);
      S('#sleep' + id).size(1);
    };
    this.run = function(seconds) {
      sleep(sleepCount++, seconds);
    }
  },
  sleep: function(seconds) {
    funcunitHelper.sleeper.run(seconds);
  },
  inputText: function(selector, text) {
    S(selector).visible().focus().type(text, function() {
      S(selector).trigger('input');
    });
  },
  testFeature: function(description, scenario, testExecution) {
    jashboard.functional_tests.push(function () {
      module("Feature: " +  description, {
        setup: function() {
          S.open('index.html?test_scenario=' + scenario);
        }
      });
      testExecution();
    });
  },
};
