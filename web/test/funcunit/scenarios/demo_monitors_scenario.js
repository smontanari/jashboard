(function() {
  var monitorCounter = 0;
  var storedMonitors = [];
  var generateDate = function() {
    var oneMonth = 30 * 24 * 3600000;
    var date = new Date();
    date.setTime(date.getTime() - jashboard.test.randomInt(oneMonth));
    return date;
  };
  var runtimeContentGenerator = {
    build: function() {
      return {
        lastBuildTime: moment(generateDate()).format("YYYY-DD-MM HH:mm:ss ZZ"),
        duration: jashboard.test.randomInt(1000),
        success: jashboard.test.randomBoolean(),
        status: jashboard.test.randomInt(2)
      };
    },
    ipsum: function() {
      return {
        text: "some very random generated text\nwith some very random generated words"
      };
    },
    vcs: function(monitor) {
      var historyLength = monitor.configuration.historyLength;
      var commits = [];
      for (var i = 0; i < historyLength; i++) {
        commits.push({
          revisionId: jashboard.test.randomInt(1000) + "aa1dd5cd1b2315e75c26e6c53169148054948",
          author: "Test Author Name",
          email: "test.email@test.com",
          date: moment(generateDate()).format("YYYY-DD-MM HH:mm:ss ZZ"),
          message: "It took me a while to figure out how to flick this stupid panel"
        });
      };
      return commits;
    }
  };

  smocker.scenario('demo_monitors', function() {
    this.post(/^\/ajax\/dashboard\/(\w+)\/monitor$/).respondWith(function(url, requestData) {
      var data = JSON.parse(requestData);
      monitorCounter++;
      storedMonitors.push({id: "monitor_" + monitorCounter, type: data.type, configuration: data.configuration});
      steal.dev.log("created monitor");
      steal.dev.log(data);
      return {
        status: 201,
        content: {
          id: "monitor_" + monitorCounter,
          name: data.name,
          refreshInterval: data.refreshInterval,
          type: data.type,
          position: data.position,
          size: data.size,
          configuration: data.configuration
        },
        delay: jashboard.test.randomInt(3)
      };
    });

    this.get(/^\/ajax\/monitor\/(\w+)\/runtime$/).respondWith(function(url, data, headers, monitor_id) {
      var monitor = _.find(storedMonitors, function(m) {
        return monitor_id === m.id;
      });
      return {
        content: runtimeContentGenerator[monitor.type](monitor),
        delay: jashboard.test.randomInt(3)
      };
    });

    this.put(/^\/ajax\/monitor\/(\w+)\/configuration$/).respondWith(function(url, data, headers, monitor_id) {
      steal.dev.log("monitor[" + monitor_id + "] configuration changed to ");
      steal.dev.log(data);
      var monitor = _.find(storedMonitors, function(m) {
        return monitor_id === m.id;
      });
      monitor.configuration = JSON.parse(data).configuration;
      return {status: 204};
    });
  });
})();
