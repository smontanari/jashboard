funcunitHelper.testFeature("Create a new vcs monitor", "vcs_monitor_actions_scenario", function() {
  test("should create a new git monitor", function() {
    S("#tab-dashboard_2").visible().click();
    jashboardFeatureHelper.openMonitorDialog("dashboard_2");
    jashboardFeatureHelper.inputGenericMonitorData({
      monitorName: "Test git-monitor",
      monitorRefresh: "30",
      monitorType: "vcs"
    });
    S("#configuration-next").visible().click();

    vcsMonitorFeatureHelper.inputVcsMonitorData(true, {
      configurationType: "git",
      vcsWorkingDir: "/test/path/to/repo",
      vcsBranch: "test-branch",
      vcsHistoryLength: "10",
      vcsPageSlideShow: true,
      vcsPageSize: "2"
    });

    S("#configuration-save").visible().click();

    S("#dashboard_2 .monitor-panel").size(3, function() {
      S("#monitor_102").visible();

      // FuncUnit.wait(500, function() {
      //   pageHelper.verifyElementContent("#monitor_102",
      //     {
      //       '.monitor-title': "Test git-monitor",
      //       '.build-time': "28-03-2013 15:10:50",
      //       '.build-duration': "08:50",
      //       '.build-result': "success",
      //       '.build-status': "building"
      //     }
      //   );
      // });
    });
  });
});

