funcunitHelper.testFeature("Edit a monitor", "monitor_actions_scenario", function() {
  test("should update the monitor basic properties", function() {
    jashboardFeatureHelper.triggerMonitorAction("#monitor_1", "edit");
    S("input[name='monitorName']").visible().val("Zombie-Dash build", "display the existing name");
    S("input[name='monitorRefresh']").visible().val("10000", "display the existing interval");

    jashboardFeatureHelper.inputGenericMonitorData({
      monitorName: "New Zombie build",
      monitorRefresh: "20000"
    });

    S("#configuration-next").visible().click();

    S("#configuration-save").visible().click();

    FuncUnit.wait(500, function() {
      pageHelper.verifyElementContent("#monitor_1",
        {
          '.monitor-title': "New Zombie build"
        }
      );
    });

    jashboardFeatureHelper.triggerMonitorAction("#monitor_1", "edit");
    S("input[name='monitorName']").visible().val("New Zombie build", "display the modified name");
    S("input[name='monitorRefresh']").visible().val("20000", "display the modified interval");
  });
});
