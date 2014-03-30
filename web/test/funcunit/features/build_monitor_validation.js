funcunitHelper.testFeature("Build monitor validation", "build_monitor_actions", function() {
  this.createTest("should validate build monitor fields on creation", function() {
    jashboardFeatureHelper.openMonitorDialog("dashboard_1");
    jashboardFeatureHelper.inputGenericMonitorData({
      monitorName: "Test jenkins-monitor",
      monitorRefresh: "30",
      monitorType: "build"
    });
    F("#configuration-next").visible().click();
    
    pageHelper.verifyElementDisabled("#configuration-save", "the Save button should be disabled");

    F("#buildServerNameRequiredError").invisible("should not display error");
    F("#buildServerPortRequiredError").invisible("should not display error");
    F("#buildServerPortNumberError").invisible("should not display error");
    pageHelper.inputText("buildServerName", "test name");
    pageHelper.inputText("buildServerPort", "123");
    F("#ciServerType-go-tab").visible().click();
    buildMonitorFeatureHelper.verifyBuildFormValidationErrors("go");
    F("#ciServerType-jenkins-tab").visible().click();
    buildMonitorFeatureHelper.verifyBuildFormValidationErrors("jenkins");
  });
  
  this.createTest("should validate build monitor fields on modification", function() {
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