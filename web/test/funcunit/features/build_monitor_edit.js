funcunitHelper.testFeature("Edit a build monitor", "build_monitor_actions_scenario", function() {
  test("should update the jenkins monitor properties", function() {
    jashboardFeatureHelper.triggerMonitorAction("#monitor_1", "edit");

    S("#configuration-next").visible().click();

    S("input[name='buildServerName']").visible().val("zombie-dev.host.com", "display the existing hostname");
    S("input[name='buildServerPort']").visible().val("9080", "display the existing port");
    S("input[name='jenkinsBuildId']").visible().val("zombie_build", "display the existing buid_id");

    buildMonitorFeatureHelper.inputBuildMonitorData(false, {
      buildServerName: "zombie-test.host.com",
      buildServerPort: "5678",
      configurationType: "jenkins",
      build_id: "new_build"
    });

    S("#configuration-save").visible().click();

    FuncUnit.wait(500, function() {
      jashboardFeatureHelper.triggerMonitorAction("#monitor_1", "edit");
      S("#configuration-next").visible().click();
      S("input[name='buildServerName']").visible().val("zombie-test.host.com", "display the modified hostname");
      S("input[name='buildServerPort']").visible().val("5678", "display the modified port");
      S("input[name='jenkinsBuildId']").visible().val("new_build", "display the modified buid_id");
    });
  });

  test("should update the go monitor properties", function() {
    S("#tab-dashboard_2").visible().click();
    jashboardFeatureHelper.triggerMonitorAction("#monitor_2", "edit");

    S("#configuration-next").visible().click();

    S("input[name='buildServerName']").visible().val("epic-ci.test.com", "display the existing hostname");
    S("input[name='buildServerPort']").visible().val("81", "display the existing port");
    S("input[name='goPipeline']").visible().val("epic main", "display the existing pipeline");
    S("input[name='goStage']").visible().val("epic build", "display the existing stage");
    S("input[name='goJob']").visible().val("unit-integration tests", "display the existing job");

    buildMonitorFeatureHelper.inputBuildMonitorData(false, {
      buildServerName: "epic-ci.uat.com",
      buildServerPort: "4777",
      configurationType: "go",
      pipeline: "new_pipeline",
      stage: "new_stage",
      job: "new_job"
    });

    S("#configuration-save").visible().click();

    FuncUnit.wait(500, function() {
      jashboardFeatureHelper.triggerMonitorAction("#monitor_2", "edit");
      S("#configuration-next").visible().click();
      S("input[name='buildServerName']").visible().val("epic-ci.uat.com", "display the modified hostname");
      S("input[name='buildServerPort']").visible().val("4777", "display the modified port");
      S("input[name='goPipeline']").visible().val("new_pipeline", "display the existing pipeline");
      S("input[name='goStage']").visible().val("new_stage", "display the existing stage");
      S("input[name='goJob']").visible().val("new_job", "display the existing job");
    });
  });
});
