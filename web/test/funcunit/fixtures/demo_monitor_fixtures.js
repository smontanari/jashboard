(function() {
  var server = jashboard.test.getFakeServer();
  var monitorCounter = 0;
  server.fakeResponse("POST", /\/ajax\/dashboard\/\w+\/monitor/, function(request, dashboard_id) {
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
      }
    };
    var data = JSON.parse(request.requestBody);
    monitorCounter++;
    return {
      content: {
        "id": "monitor_" + monitorCounter,
        "name": data.name,
        "refresh_interval": data.refreshInterval,
        "type": data.type,
        "configuration": monitorConfigurationFixtures[data.type](data.configuration)
      },
      delay: 1
    };
  });

  server.fakeResponse("GET", /\/ajax\/monitor\/\w+\/runtime/, function(request, monitor_id) {
    var generateDate = function() {
      var oneMonth = 30 * 24 * 3600000;
      var date = new Date();
      date.setTime(date.getTime() - jashboard.test.randomInt(oneMonth));
      return jashboard.test.dateFormat(date);
    };
    return {
      content: {
        last_build_time: generateDate(),
        duration: jashboard.test.randomInt(1000),
        success: jashboard.test.randomInt(1) === 1,
        status: jashboard.test.randomInt(2)
      },
      delay: jashboard.test.randomInt(5)
    };
  });

  server.fakeResponse("PUT", /\/ajax\/monitor\/(\w+)\/position/, {});
  server.fakeResponse("PUT", /\/ajax\/monitor\/(\w+)\/size/, {});
  server.fakeResponse("DELETE", /\ajax\/monitor\/\w+/, {});
}());