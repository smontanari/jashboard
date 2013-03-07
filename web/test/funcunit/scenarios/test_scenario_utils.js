(function(testModule) {
  var pad10 = function (n){return n<10 ? '0'+n : n};

  jashboard.test = _.extend(testModule, {
    randomInt: function(n) {
      return Math.floor(Math.random() * (n+1));
    },
    dateFormat: function(date) {
      return date.getFullYear() + "-" + pad10(date.getMonth()) + "-" + pad10(date.getDate()) + " " +
             pad10(date.getHours()) + ":" + pad10(date.getMinutes()) + ":" + pad10(date.getSeconds())      
    }
  });
}(jashboard.test || {}));
