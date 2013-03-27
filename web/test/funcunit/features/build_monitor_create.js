funcunitHelper.testFeature("Build monitor create", "create_build_monitor", function() {
  var inputBuildMonitorData = function(data) {
    var monitorTypeConfigurationInput = {
      jenkins: function(data) {
        pageHelper.inputText("input[name='buildSettings-Jenkins-build_id']", data.build_id);
      },
      go: function(data) {
        pageHelper.inputText("input[name='buildSettings-go-pipeline']", data.pipeline);
        pageHelper.inputText("input[name='buildSettings-go-stage']", data.stage);
        pageHelper.inputText("input[name='buildSettings-go-job']", data.job);
      }
    };

    pageHelper.inputText("input[name='serverName']", data.serverName);
    pageHelper.inputText("input[name='serverPort']", data.serverPort);
    S("#buildSettings-" + data.configurationType + "-tab").visible().click();
    monitorTypeConfigurationInput[data.configurationType](data);
  };

  test("should create a new jenkins build monitor", function() {
    jashboardFeatureHelper.openMonitorDialog("dashboard_1");
    jashboardFeatureHelper.inputGenericMonitorData({
      monitorName: "Test jenkins-monitor",
      monitorRefresh: "30",
      monitorType: "build"
    });
    inputBuildMonitorData({
      configurationType: "jenkins",
      serverName: "jenkins-server",
      serverPort: "1234",
      build_id: "jenkins-build-123"
    });

    S("#configuration-save").visible().click();

    S("#dashboard_1 .monitor-panel").size(2, function() {
      S("#monitor_2").visible();

      FuncUnit.wait(500, function() {
        pageHelper.verifyElementContent("#monitor_2",
          {
            '.monitor-title': "Test jenkins-monitor",
            '.build-time': "28-08-2012 11:25:10",
            '.build-duration': "09:56",
            '.build-result': "failure",
            '.build-status': "building"
          }
        );
      });
    });
  });
  test("should create a new go build monitor", function() {
    jashboardFeatureHelper.openMonitorDialog("dashboard_1");
    jashboardFeatureHelper.inputGenericMonitorData({
      monitorName: "Test go-monitor",
      monitorRefresh: "30",
      monitorType: "build"
    });
    inputBuildMonitorData({
      configurationType: "go",
      serverName: "go-server",
      serverPort: "1234",
      pipeline: "test-pipeline",
      stage: "test-stage",
      job: "test-job"
    });

    S("#configuration-save").visible().click();

    S("#dashboard_1 .monitor-panel").size(2, function() {
      S("#monitor_2").visible();

      FuncUnit.wait(500, function() {
        pageHelper.verifyElementContent("#monitor_2",
          {
            '.monitor-title': "Test go-monitor",
            '.build-time': "28-08-2012 11:25:10",
            '.build-duration': "09:56",
            '.build-result': "failure",
            '.build-status': "building"
          }
        );
      });
    });
  });
});

