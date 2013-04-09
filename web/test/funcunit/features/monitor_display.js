funcunitHelper.testFeature("Display build monitor information", "display_dashboards_data", function() {
  test("should load and display build monitor data", function() {
    S("#tab-dashboard_3").visible().click();
    S(".build-panel-runtime").invisible("No build monitors are visible");
    S("#tab-dashboard_2").visible().click();
    pageHelper.verifyElementContent("#monitor_2",
      {
        '.monitor-title': "Epic build",
        '.build-time': "28-08-2012 11:25:10",
        '.build-duration': "09:56",
        '.build-result': "failure",
        '.build-status': "building"
      }
    );
    pageHelper.verifyElementContent("#monitor_3",
      {
        '.monitor-title': "Random text",
        'pre': "some very random generated text\nwith some very random generated words"
      }
    );
    S("#tab-dashboard_1").visible().click();
    pageHelper.verifyElementContent("#monitor_1",
      {
        '.monitor-title': "Zombie-Dash build",
        '.build-time': "05-11-2012 09:35:08",
        '.build-duration': "25",
        '.build-result': "success",
        '.build-status': "building"
      }
    );
  });
});
