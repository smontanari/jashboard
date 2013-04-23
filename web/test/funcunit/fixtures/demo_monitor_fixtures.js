(function() {
  var server = jashboard.test.getFakeServer();
  var monitorCounter = 0;
  var storedMonitors = [];
  server.fakeResponse("POST", /^\/ajax\/dashboard\/(\w+)\/monitor$/, function(request, dashboard_id) {
    var data = JSON.parse(request.requestBody);
    monitorCounter++;
    storedMonitors.push({id: "monitor_" + monitorCounter, type: data.type, configuration: data.configuration});
    steal.dev.log("created monitor");
    steal.dev.log(data);
    return {
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

  server.fakeResponse("GET", /^\/ajax\/monitor\/(\w+)\/runtime$/, function(request, monitor_id) {
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
    var monitor = _.find(storedMonitors, function(m) {
      return monitor_id === m.id;
    });
    return {
      content: runtimeContentGenerator[monitor.type](monitor),
      delay: jashboard.test.randomInt(3)
    };
  });

  server.fakeResponse("PUT", /^\/ajax\/monitor\/(\w+)\/configuration$/, function(request, monitor_id) {
    steal.dev.log("monitor[" + monitor_id + "] configuration changed to ");
    steal.dev.log(request.requestBody);
    var monitor = _.find(storedMonitors, function(m) {
      return monitor_id === m.id;
    });
    monitor.configuration = JSON.parse(request.requestBody).configuration;
    return {returnCode: 204};
  });
  server.fakeResponse("PUT", /^\/ajax\/monitor\/(\w+)\/position$/, function(request, monitor_id) {
    var position = JSON.parse(request.requestBody);
    steal.dev.log("monitor[" + monitor_id + "] moved to [top: " + position.top + ", left: " + position.left + "]");
    return {returnCode: 204};
  });
  server.fakeResponse("PUT", /^\/ajax\/monitor\/(\w+)\/size$/, function(request, monitor_id) {
    var size = JSON.parse(request.requestBody);
    steal.dev.log("monitor[" + monitor_id + "] resized to [width: " + size.width + ", height: " + size.height + "]");
    return {returnCode: 204};
  });
  server.fakeResponse("DELETE", /^\/ajax\/dashboard\/(\w+)\/monitor\/(\w+)$/, function(request, dashboard_id, monitor_id) {
    steal.dev.log("monitor[" + monitor_id + "] deleted");
    return {returnCode: 204, delay: 1};
  });
}());