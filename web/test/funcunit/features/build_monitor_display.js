funcunitHelper.testFeature("Display build monitor information", "display_dashboards_data", function() {
  this.createTest("should load and display build monitor data", function() {
    F("#tab-dashboard_3").visible().click();
    F(".build-panel-runtime").invisible("No build monitors are visible");
    F("#tab-dashboard_2").visible().click();
    pageHelper.verifyElementContent("#monitor_2",
      {
        '.monitor-name': "Epic build",
        '.build-time': "28-08-2012 10:25:10",
        '.build-duration': "09:56",
        '.build-result': "failure",
        '.build-status': "building"
      }
    );

    F("#tab-dashboard_1").visible().click();
    pageHelper.verifyElementContent("#monitor_1",
      {
        '.monitor-name': "Zombie-Dash build",
        '.build-time': "05-11-2012 09:35:08",
        '.build-duration': "25",
        '.build-result': "success",
        '.build-status': "building"
      }
    );
  });
});
