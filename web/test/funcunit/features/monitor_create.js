funcunitHelper.testFeature("Monitor create", "create_monitor", function() {
  var openMonitorDialog = function() {
    S("#dashboard_1-actions").click();
    S("#dashboard_1 .dashboard-actions .new-monitor").visible("display new monitor menu action").click();
    S("#new-monitor-form").visible("show new monitor modal");
  };

  test("should create a new build monitor", function() {
    openMonitorDialog();
    funcunitHelper.inputText("input[name='monitorName']", "test new-monitor");
    funcunitHelper.inputText("input[name='monitorRefresh']", "30");
    S("select[name='monitorType']").visible().click();
    S("select[name='monitorType'] option:eq(1)").visible().click();

    S("#configuration-next").visible().click();

    funcunitHelper.inputText("input[name='serverName']", "test server-name");
    funcunitHelper.inputText("input[name='serverPort']", "1234");
    funcunitHelper.inputText("input[name='buildSettings-Jenkins-build_id']", "jenkins-build-123");

    S("#configuration-save").visible().click()

    S(".monitor-panel").size("2");
    S("#monitor_2").visible();
  });
});

