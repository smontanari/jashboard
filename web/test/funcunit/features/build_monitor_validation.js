funcunitHelper.testFeature("Build monitor validation", "build_monitor_actions_scenario", function() {
  test("should validate build monitor fields on creation", function() {
    jashboardFeatureHelper.openMonitorDialog("dashboard_1");
    jashboardFeatureHelper.inputGenericMonitorData({
      monitorName: "Test jenkins-monitor",
      monitorRefresh: "30",
      monitorType: "build"
    });
    S("#configuration-next").visible().click();
    
    pageHelper.verifyElementDisabled("#configuration-save", "the Save button should be disabled");

    S("#buildServerNameRequiredError").invisible("should not display error");
    S("#buildServerPortRequiredError").invisible("should not display error");
    S("#buildServerPortNumberError").invisible("should not display error");
    pageHelper.inputText("input[name='buildServerName']", "test name");
    pageHelper.inputText("input[name='buildServerPort']", "123");
    
    buildMonitorFeatureHelper.verifyBuildFormValidationErrors("jenkins");
    S("#ciServerType-go-tab").visible().click();
    buildMonitorFeatureHelper.verifyBuildFormValidationErrors("go");
  });
  
  test("should validate build monitor fields on modification", function() {
    jashboardFeatureHelper.triggerMonitorAction("#monitor_1", "edit");

    S("#configuration-next").visible().click();
    buildMonitorFeatureHelper.verifyBuildFormValidationErrors("jenkins");

    S("#cancelMonitor").visible().click();

    S("#tab-dashboard_2").visible().click();
    FuncUnit.wait(300, function() {
      jashboardFeatureHelper.triggerMonitorAction("#monitor_2", "edit");
    });

    S("#configuration-next").visible().click();
    buildMonitorFeatureHelper.verifyBuildFormValidationErrors("go");
  });
});