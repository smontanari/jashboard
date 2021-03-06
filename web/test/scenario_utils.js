(function(testModule) {
  var pad10 = function (n){return n<10 ? '0'+n : n};

  jashboard.test = _.extend(testModule, {
    randomInt: function(n) {
      return Math.floor(Math.random() * (n+1));
    },
    randomBoolean: function() {
      return this.randomInt(1) == 1;
    }
  });
}(jashboard.test || {}));
