funcunitHelper.testFeature("Monitor display", "display_dashboards_data", function() {
  test("should load and display build monitor data", function() {
    S(".dashboard-tab a[href='#dashboard_3']").click();
    S(".build-panel").invisible("No build monitors are visible");
    S(".dashboard-tab a[href='#dashboard_2']").click();
    featureHelper.verifyMonitorData("#monitor_2",
      {
        '.monitor-title': "Epic build",
        '.build-time': "28-08-2012 11:25:10",
        '.build-duration': "09:56",
        '.build-result': "failure",
        '.build-status': "building"
      }
    );
    featureHelper.verifyMonitorData("#monitor_3",
      {
        '.monitor-title': "Forum build",
        '.build-time': "25-08-2012 15:56:45",
        '.build-duration': "02:06",
        '.build-result': "failure",
        '.build-status': "idle"
      }
    );
    S(".dashboard-tab a[href='#dashboard_1']").click();
    featureHelper.verifyMonitorData("#monitor_1",
      {
        '.monitor-title': "Zombie-Dash build",
        '.build-time': "23-08-2012 14:32:23",
        '.build-duration': "12:32",
        '.build-result': "success",
        '.build-status': "idle"
      }
    );
  });
});
