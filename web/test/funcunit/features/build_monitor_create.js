funcunitHelper.testFeature("Create a new build monitor", "build_monitor_actions", function() {
  this.createTest("should create a new jenkins build monitor", function() {
    jashboardFeatureHelper.openMonitorDialog("dashboard_1");
    jashboardFeatureHelper.inputGenericMonitorData({
      monitorName: "Test jenkins-monitor",
      monitorRefresh: "30",
      monitorType: "build"
    });
    F("#configuration-next").visible().click();

    buildMonitorFeatureHelper.inputBuildMonitorData(true, {
      configurationType: "jenkins",
      buildServerName: "jenkins-server",
      buildServerPort: "1234",
      buildId: "jenkins-build-123"
    });

    F("#configuration-save").visible().click();

    F("#dashboard_1 .monitor-panel").size(3, function() {
      F("#monitor_101").visible();

      FuncUnit.wait(500, function() {
        pageHelper.verifyElementContent("#monitor_101",
          {
            '.monitor-name': "Test jenkins-monitor",
            '.build-time': "28-03-2013 16:10:50",
            '.build-duration': "08:50",
            '.build-result': "success",
            '.build-status': "building"
          }
        );
      });
    });
  });
  this.createTest("should create a new go build monitor", function() {
    jashboardFeatureHelper.openMonitorDialog("dashboard_1");
    jashboardFeatureHelper.inputGenericMonitorData({
      monitorName: "Test go-monitor",
      monitorRefresh: "30",
      monitorType: "build"
    });
    F("#configuration-next").visible().click();

    buildMonitorFeatureHelper.inputBuildMonitorData(true, {
      configurationType: "go",
      buildServerName: "go-server",
      buildServerPort: "1234",
      pipeline: "test-pipeline",
      stage: "test-stage",
      job: "test-job"
    });

    F("#configuration-save").visible().click();

    F("#dashboard_1 .monitor-panel").size(3, function() {
      F("#monitor_101").visible();

      FuncUnit.wait(500, function() {
        pageHelper.verifyElementContent("#monitor_101",
          {
            '.monitor-name': "Test go-monitor",
            '.build-time': "28-03-2013 16:10:50",
            '.build-duration': "08:50",
            '.build-result': "success",
            '.build-status': "building"
          }
        );
      });
    });
  });
});

