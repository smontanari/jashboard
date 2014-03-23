funcunitHelper.testFeature("Edit a monitor", "monitor_actions", function() {
  test("should update the monitor basic properties", function() {
    jashboardFeatureHelper.triggerMonitorAction("#monitor_1", "edit");
    pageHelper.verifyInputValue("monitorName", "Zombie-Dash build", "display the existing name");
    pageHelper.verifyInputValue("monitorRefresh", "10000", "display the existing interval");

    jashboardFeatureHelper.inputGenericMonitorData({
      monitorName: "New Zombie build",
      monitorRefresh: "20000"
    });

    S("#configuration-next").visible().click();

    S("#configuration-save").visible().click();

    FuncUnit.wait(500, function() {
      pageHelper.verifyElementContent("#monitor_1",
        {
          '.monitor-name': "New Zombie build"
        }
      );
    });

    jashboardFeatureHelper.triggerMonitorAction("#monitor_1", "edit");
    pageHelper.verifyInputValue("monitorName", "New Zombie build", "display the modified name");
    pageHelper.verifyInputValue("monitorRefresh", "20000", "display the modified interval");
  });
});
