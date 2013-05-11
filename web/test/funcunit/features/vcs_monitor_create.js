funcunitHelper.testFeature("Create a new vcs monitor", "vcs_monitor_actions", function() {
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
      vcsHistoryLength: "10"
    });

    S("#configuration-save").visible().click();

    S("#dashboard_2 .monitor-panel").size(3, function() {
      S("#monitor_102").visible();

      FuncUnit.wait(500, function() {
        S("#monitor_102 .vcs-panel .vcs-info-group .git-info").size(4, "should contain four git commits");
        var expectedData = [
          {commit: "6a1dd5cd1b2315e75c26e6c53169148054948ac3", date: "Sat Apr 20 21:35:47 2013 +1000", message: "simplifying data conversion. removing ModelMapper"},
          {commit: "3a635eb5e043324c11563b9d11a462fd27cf83a5", date: "Sat Apr 20 00:21:12 2013 +1000", message: "refactored pagination logic into a separate service."},
          {commit: "65bc20de71bff444eb6202d46829da8a739fae3b", date: "Fri Apr 19 17:20:37 2013 +1000", message: "added SwitchButtonDirective to support toggle buttons"},
          {commit: "5594e000e10c10f647e96ab8fd1ae3f7d3442069", date: "Thu Apr 18 09:18:15 2013 +1000", message: "Merge branch 'spike-slide-show-effect'"}
        ];
        _.each(expectedData, function(data, index) {
          pageHelper.verifyElementContent("#monitor_102 .vcs-panel .vcs-info-group .git-info:nth-child("+ (index + 1) + ")",
            {
              '.git-commit': "commit " + data.commit,
              '.git-author-date p:nth-child(1)': "Author:Silvio Montanari <montanari.silvio@gmail.com>",
              '.git-author-date p:nth-child(2)': "Date:" + data.date,
              '.git-comment': data.message
            }
          );
        });
      });
    });
  });
});

