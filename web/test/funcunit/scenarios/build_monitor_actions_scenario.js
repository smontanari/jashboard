steal("test/funcunit/scenarios/display_dashboards_data.js");
$.fixture("POST /ajax/dashboard/dashboard_1/monitor", function(ajaxOriginalOptions, ajaxOptions, headers) {
  var data = JSON.parse(ajaxOptions.data);
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
    return [
      201, 
      "success",
      jashboard.test.monitorJsonResponseFixture("monitor_4", data),
      {} 
    ];
  }
  throw "unexpected data in the POST request: " + ajaxOptions.data;
});

$.fixture("PUT /ajax/monitor/{id}/configuration", function(ajaxOriginalOptions, ajaxOptions, headers) {
  var data = JSON.parse(ajaxOptions.data);
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
    return [204, "success", {}, {} ];
  }
  throw "unexpected data in the PUT request: " + ajaxOptions.data;
});
