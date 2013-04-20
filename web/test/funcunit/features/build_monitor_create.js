funcunitHelper.testFeature("Create a new Build monitor", "build_monitor_actions_scenario", function() {
  test("should create a new jenkins build monitor", function() {
    jashboardFeatureHelper.openMonitorDialog("dashboard_1");
    jashboardFeatureHelper.inputGenericMonitorData({
      monitorName: "Test jenkins-monitor",
      monitorRefresh: "30",
      monitorType: "build"
    });
    S("#configuration-next").visible().click();

    buildMonitorFeatureHelper.inputBuildMonitorData(true, {
      configurationType: "jenkins",
      buildServerName: "jenkins-server",
      buildServerPort: "1234",
      buildId: "jenkins-build-123"
    });

    S("#configuration-save").visible().click();

    S("#dashboard_1 .monitor-panel").size(2, function() {
      S("#monitor_4").visible();

      FuncUnit.wait(500, function() {
        pageHelper.verifyElementContent("#monitor_4",
          {
            '.monitor-title': "Test jenkins-monitor",
            '.build-time': "28-03-2013 15:10:50",
            '.build-duration': "08:50",
            '.build-result': "success",
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
    S("#configuration-next").visible().click();

    buildMonitorFeatureHelper.inputBuildMonitorData(true, {
      configurationType: "go",
      buildServerName: "go-server",
      buildServerPort: "1234",
      pipeline: "test-pipeline",
      stage: "test-stage",
      job: "test-job"
    });

    S("#configuration-save").visible().click();

    S("#dashboard_1 .monitor-panel").size(2, function() {
      S("#monitor_4").visible();

      FuncUnit.wait(500, function() {
        pageHelper.verifyElementContent("#monitor_4",
          {
            '.monitor-title': "Test go-monitor",
            '.build-time': "28-03-2013 15:10:50",
            '.build-duration': "08:50",
            '.build-result': "success",
            '.build-status': "building"
          }
        );
      });
    });
  });
});

