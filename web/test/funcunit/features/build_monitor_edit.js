funcunitHelper.testFeature("Edit a build monitor", "build_monitor_actions", function() {
  this.createTest("it updates the jenkins monitor properties", function() {
    jashboardFeatureHelper.triggerMonitorAction("#monitor_1", "edit");

    F("#configuration-next").visible().click();

    pageHelper.verifyInputValue("buildServerName", "zombie-dev.host.com", "display the existing hostname");
    pageHelper.verifyInputValue("buildServerPort", "9080", "display the existing port");
    pageHelper.verifyInputValue("jenkinsBuildId", "zombie_build", "display the existing buid_id");

    buildMonitorFeatureHelper.inputBuildMonitorData(false, {
      buildServerName: "zombie-test.host.com",
      buildServerPort: "5678",
      configurationType: "jenkins",
      buildId: "new_build"
    });

    F("#configuration-save").visible().click();

    FuncUnit.wait(500, function() {
      jashboardFeatureHelper.triggerMonitorAction("#monitor_1", "edit");
      F("#configuration-next").visible().click();
      pageHelper.verifyInputValue("buildServerName", "zombie-test.host.com", "display the modified hostname");
      pageHelper.verifyInputValue("buildServerPort", "5678", "display the modified port");
      pageHelper.verifyInputValue("jenkinsBuildId", "new_build", "display the modified buid_id");
    });
  });

  this.createTest("it updates the go monitor properties", function() {
    F("#tab-dashboard_2").visible().click();
    jashboardFeatureHelper.triggerMonitorAction("#monitor_2", "edit");

    F("#configuration-next").visible().click();

    pageHelper.verifyInputValue("buildServerName", "epic-ci.test.com", "display the existing hostname");
    pageHelper.verifyInputValue("buildServerPort", "81", "display the existing port");
    pageHelper.verifyInputValue("goPipeline", "epic main", "display the existing pipeline");
    pageHelper.verifyInputValue("goStage", "epic build", "display the existing stage");
    pageHelper.verifyInputValue("goJob", "unit-integration tests", "display the existing job");

    buildMonitorFeatureHelper.inputBuildMonitorData(false, {
      buildServerName: "epic-ci.uat.com",
      buildServerPort: "4777",
      configurationType: "go",
      pipeline: "new_pipeline",
      stage: "new_stage",
      job: "new_job"
    });

    F("#configuration-save").visible().click();

    FuncUnit.wait(500, function() {
      jashboardFeatureHelper.triggerMonitorAction("#monitor_2", "edit");
      F("#configuration-next").visible().click();
      pageHelper.verifyInputValue("buildServerName", "epic-ci.uat.com", "display the modified hostname");
      pageHelper.verifyInputValue("buildServerPort", "4777", "display the modified port");
      pageHelper.verifyInputValue("goPipeline", "new_pipeline", "display the existing pipeline");
      pageHelper.verifyInputValue("goStage", "new_stage", "display the existing stage");
      pageHelper.verifyInputValue("goJob", "new_job", "display the existing job");
    });
  });
});
