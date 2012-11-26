funcunitHelper.testFeature("Monitor display", "display_dashboards_data", function() {
  var verifyMonitorData = function(monitor_id, expectedData) {
    S(monitor_id).visible(function() {
      _.each(_.keys(expectedData), function(propertySelector) {
        equal(S(monitor_id + " " + propertySelector).text(), expectedData[propertySelector], "verifying content of " + propertySelector);
      });
    });
  };

  test("should load and display build monitor data", function() {
    S(".dashboard-tab a[href='#dashboard_3']").click();
    S(".build-panel").invisible("No build monitors are visible");
    S(".dashboard-tab a[href='#dashboard_2']").click();
    verifyMonitorData("#monitor_2",
      {
        '.monitor-title': "Epic build",
        '.build-time': "28-08-2012 11:25:10",
        '.build-duration': "09:56",
        '.build-result': "success",
        '.build-status': "building"
      }
    );
    verifyMonitorData("#monitor_3",
      {
        '.monitor-title': "Forum build",
        '.build-time': "25-08-2012 15:56:45",
        '.build-duration': "02:06",
        '.build-result': "failure",
        '.build-status': "idle"
      }
    );
    S(".dashboard-tab a[href='#dashboard_1']").click();
    verifyMonitorData("#monitor_1",
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
