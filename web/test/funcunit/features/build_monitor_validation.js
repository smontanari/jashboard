funcunitHelper.testFeature("Build monitor validation", "build_monitor_actions", function() {
  this.createTest("it validates build monitor fields on creation", function() {
    jashboardFeatureHelper.openMonitorDialog("dashboard_1");
    jashboardFeatureHelper.inputGenericMonitorData({
      monitorName: "Test jenkins-monitor",
      monitorRefresh: "30",
      monitorType: "build"
    });
    F("#configuration-next").visible().click();

    pageHelper.verifyElementDisabled("#configuration-save", "the Save button is disabled");

    F("#buildServerNameRequiredError").invisible("does not display error");
    F("#buildServerPortRequiredError").invisible("does not display error");
    F("#buildServerPortNumberError").invisible("does not display error");
    pageHelper.inputText("buildServerName", "test name");
    pageHelper.inputText("buildServerPort", "123");
    F("#ciServerType-go-tab").visible().click();
    buildMonitorFeatureHelper.verifyBuildFormValidationErrors("go");
    F("#ciServerType-jenkins-tab").visible().click();
    buildMonitorFeatureHelper.verifyBuildFormValidationErrors("jenkins");
  });

  this.createTest("it validates build monitor fields on modification", function() {
    jashboardFeatureHelper.triggerMonitorAction("#monitor_1", "edit");

    F("#configuration-next").visible().click();
    buildMonitorFeatureHelper.verifyBuildFormValidationErrors("jenkins");

    F("#cancelMonitor").visible().click();

    F("#tab-dashboard_2").visible().click();
    FuncUnit.wait(300, function() {
      jashboardFeatureHelper.triggerMonitorAction("#monitor_2", "edit");
    });

    F("#configuration-next").visible().click();
    buildMonitorFeatureHelper.verifyBuildFormValidationErrors("go");
  });
});