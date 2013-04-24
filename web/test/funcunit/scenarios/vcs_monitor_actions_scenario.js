steal("test/funcunit/scenarios/display_dashboards_data.js");

(function() {
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
  $.fixture("POST /ajax/dashboard/dashboard_2/monitor", function(ajaxOriginalOptions, ajaxOptions, headers) {
    var data = JSON.parse(ajaxOptions.data);
    var monitorConfigOk = data.name === "Test " + data.configuration.type + "-monitor" &&
      data.refreshInterval === 30 &&
      data.type === "vcs";

    var vcsConfigOk = _.isEqual(data.configuration, expectedConfig[data.configuration.type]);
    
    if (monitorConfigOk && vcsConfigOk) {
      return [
        201, 
        "success",
        _.extend(data, {id: "monitor_102"}),
        {} 
      ];
    }
    throw "unexpected data in the POST request: " + ajaxOptions.data;
  });

  $.fixture("PUT /ajax/monitor/{id}/configuration", function(ajaxOriginalOptions, ajaxOptions, headers) {
    var data = JSON.parse(ajaxOptions.data);
    var vcsConfigOk = _.isEqual(data.configuration, expectedConfig[data.configuration.type]);
    
    if (vcsConfigOk) {
      return [204, "success", {}, {} ];
    }
    throw "unexpected data in the PUT request: " + ajaxOptions.data;
  });
}());
