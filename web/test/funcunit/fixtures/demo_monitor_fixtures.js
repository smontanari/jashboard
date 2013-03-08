(function() {
  var server = jashboard.test.getFakeServer();
  var monitorCounter = 0;
  var storedMonitors = [];
  server.fakeResponse("POST", /\/ajax\/dashboard\/(\w+)\/monitor/, function(request, dashboard_id) {
    var monitorConfigurationFixtures = {
      build: function(configuration) {
        var buildConfigurationFixtures = {
          jenkins: function() {
            return {
              "type": "jenkins",
              "build_id": configuration.build_id
            };
          },
          go: function() {
            return {
              "type": "go",
              "hostname": configuration.hostname,
              "port": configuration.port,
              "build_id": configuration.build_id              
            };
          }
        };
        return buildConfigurationFixtures[configuration.type]();
      },
      ipsum: function(configuration) {
        return configuration;
      }
    };
    var data = JSON.parse(request.requestBody);
    monitorCounter++;
    storedMonitors.push({id: "monitor_" + monitorCounter, type: data.type});
    return {
      content: {
        "id": "monitor_" + monitorCounter,
        "name": data.name,
        "refresh_interval": data.refreshInterval,
        "type": data.type,
        "configuration": monitorConfigurationFixtures[data.type](data.configuration)
      },
      delay: jashboard.test.randomInt(3)
    };
  });

  server.fakeResponse("GET", /\/ajax\/monitor\/(\w+)\/runtime/, function(request, monitor_id) {
    var generateDate = function() {
      var oneMonth = 30 * 24 * 3600000;
      var date = new Date();
      date.setTime(date.getTime() - jashboard.test.randomInt(oneMonth));
      return jashboard.test.dateFormat(date);
    };
    var runtimeContentGenerator = {
      build: function() {
        return {
          last_build_time: generateDate(),
          duration: jashboard.test.randomInt(1000),
          success: jashboard.test.randomInt(1) === 1,
          status: jashboard.test.randomInt(2)
        };
      },
      ipsum: function() {
        return {
          text: "some random generated text"
        };
      }
    };
    var monitorType = _.find(storedMonitors, function(monitor) {
      return monitor_id === monitor.id;
    }).type;
    return {
      content: runtimeContentGenerator[monitorType](),
      delay: jashboard.test.randomInt(5)
    };
  });

  server.fakeResponse("PUT", /\/ajax\/monitor\/(\w+)\/position/, function(request, monitor_id) {
    var position = JSON.parse(request.requestBody);
    steal.dev.log("monitor[" + monitor_id + "] moved to [top: " + position.top + ", left: " + position.left + "]");
    return {returnCode: 201};
  });
  server.fakeResponse("PUT", /\/ajax\/monitor\/(\w+)\/size/, function(request, monitor_id) {
    var size = JSON.parse(request.requestBody);
    steal.dev.log("monitor[" + monitor_id + "] resized to [width: " + size.width + ", height: " + size.height + "]");
    return {returnCode: 201};
  });
  server.fakeResponse("DELETE", /\/ajax\/monitor\/(\w+)/, function(request, monitor_id) {
    steal.dev.log("monitor[" + monitor_id + "] deleted");
    return {returnCode: 201};
  });
}());