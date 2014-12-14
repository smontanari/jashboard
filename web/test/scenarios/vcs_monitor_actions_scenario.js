define(["smocker", "test/scenarios/display_dashboards_data_scenario"], function(smocker) {
  var expectedConfig = {
    git: {
      type: "git",
      workingDirectory: "/test/path/to/repo",
      branch: "test-branch",
      historyLength: 10,
      pagination: false,
      commitsPerPage: 1,
      interval: 5000
    }
  };

  smocker.scenario('monitor_write_operatios', function() {
    this.post('/ajax/dashboard/dashboard_2/monitor').respondWith(function(url, requestData) {
      var data = JSON.parse(requestData);
      var monitorConfigOk = data.name === "Test " + data.configuration.type + "-monitor" &&
        data.refreshInterval === 30 &&
        data.type === "vcs";

      var vcsConfigOk = _.isEqual(data.configuration, expectedConfig[data.configuration.type]);

      if (monitorConfigOk && vcsConfigOk) {
        return {
          status: 201,
          content: _.extend(data, {id: "monitor_102"}),
        };
      }
      throw "unexpected data in the POST request: " + requestData;
    });

    this.put(/ajax\/monitor\/\w+\/configuration/).respondWith(function(url, requestData) {
      var data = JSON.parse(requestData);
      var vcsConfigOk = _.isEqual(data.configuration, expectedConfig[data.configuration.type]);

      if (vcsConfigOk) {
        return { status: 204 };
      }
      throw "unexpected data in the PUT request: " + requestData;
    });
  });

  smocker.groupScenarios('vcs_monitor_actions', ['display_dashboards_data', 'monitor_write_operatios']);
});