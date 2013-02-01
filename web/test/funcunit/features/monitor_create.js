funcunitHelper.testFeature("Monitor create", "create_monitor", function() {
  var openMonitorDialog = function() {
    S("#dashboard_1-actions").click();
    S("#dashboard_1 .dashboard-actions .new-monitor").visible("display new monitor menu action").click();
    S("#new-monitor-form").visible("show new monitor modal");
  };

  test("should create a new build monitor", function() {
    openMonitorDialog();
    S("input[name='monitorName']").visible().click().type("another monitor");
    S("input[name='monitorRefresh']").visible().click().type("30");
    S("select[name='monitorType']").visible().click();
    S("select[name='monitorType'] option:eq(1)").visible().click();

    S("#configuration-next").visible().click();

    S("input[name='serverName']").visible().click().type("test server-name");
    S("input[name='serverPort']").visible().click().type("1234");
    S("input[name='buildSettings-Jenkins-build_id']").visible().click().type("jenkins-build-123");

    S("#configuration-save").visible().click()

    S(".monitor-panel").size("2");
    S("#monitor_345").visible();
  });
});

