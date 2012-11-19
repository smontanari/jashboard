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
  }
};
