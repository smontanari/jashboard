steal(
  "test/funcunit/scenarios/display_dashboards_data_scenario.js",
  "test/funcunit/scenarios/monitor_layout_operations_scenario.js"
).then(function() {
  smocker.scenario('build_monitor_write_operations', function() {
    this.post('/ajax/dashboard/dashboard_1/monitor').respondWith(function(url, requestData) {
      var data = JSON.parse(requestData);
      var expectedConfig = {
        jenkins: {
          type: "jenkins",
          hostname: "jenkins-server",
          port: 1234,
          buildId: "jenkins-build-123"
        },
        go: {
          type: "go",
          hostname: "go-server",
          port: 1234,
          pipeline: "test-pipeline",
          stage: "test-stage",
          job: "test-job"
        }
      };
      var monitorConfigOk = data.name === "Test " + data.configuration.type + "-monitor" &&
        data.refreshInterval === 30 &&
        data.type === "build";

      var buildConfigOk = _.isEqual(data.configuration, expectedConfig[data.configuration.type]);
      
      if (monitorConfigOk && buildConfigOk) {
        return {
          status: 201, 
          content: _.extend(data, {id: "monitor_101"})
        };
      }
      throw "unexpected data in the POST request: " + requestData;
    });

    this.put(/\/ajax\/monitor\/\w+\/configuration/).respondWith(function(url, requestData) {
      var data = JSON.parse(requestData);
      var expectedConfig = {
        jenkins: {
          type: "jenkins",
          hostname: "zombie-test.host.com",
          port: 5678,
          buildId: "new_build"
        },
        go: {
          type: "go",
          hostname: "epic-ci.uat.com",
          port: 4777,
          pipeline: "new_pipeline",
          stage: "new_stage",
          job: "new_job"
        }
      };
      var buildConfigOk = _.isEqual(data.configuration, expectedConfig[data.configuration.type]);
      
      if (buildConfigOk) {
        return { status: 204 };
      }
      throw "unexpected data in the PUT request: " + requestData;
    });
  });
  
  smocker.groupScenarios('build_monitor_actions', ['display_dashboards_data', 'monitor_layout_operations', 'build_monitor_write_operations']);
})();
