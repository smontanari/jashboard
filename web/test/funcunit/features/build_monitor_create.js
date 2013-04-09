funcunitHelper.testFeature("Create a new Build monitor", "create_build_monitor", function() {
  var inputBuildMonitorData = function(data) {
    var monitorTypeConfigurationInput = {
      jenkins: function(data) {
        pageHelper.inputText("input[name='jenkins_build_id']", data.build_id);
      },
      go: function(data) {
        pageHelper.inputText("input[name='go_pipeline']", data.pipeline);
        pageHelper.inputText("input[name='go_stage']", data.stage);
        pageHelper.inputText("input[name='go_job']", data.job);
      }
    };

    pageHelper.inputText("input[name='serverName']", data.serverName);
    pageHelper.inputText("input[name='serverPort']", data.serverPort);
    S("#ciServerType-" + data.configurationType + "-tab").visible().click();
    monitorTypeConfigurationInput[data.configurationType](data);
  };

  var verifySaveButtonDisabled = function() {
    pageHelper.verifyElementDisabled("#configuration-save", "the Save button should be disabled");
  };

  test("should create a new jenkins build monitor", function() {
    jashboardFeatureHelper.openMonitorDialog("dashboard_1");
    jashboardFeatureHelper.inputGenericMonitorData({
      monitorName: "Test jenkins-monitor",
      monitorRefresh: "30",
      monitorType: "build"
    });
    inputBuildMonitorData({
      configurationType: "jenkins",
      serverName: "jenkins-server",
      serverPort: "1234",
      build_id: "jenkins-build-123"
    });

    S("#configuration-save").visible().click();

    S("#dashboard_1 .monitor-panel").size(2, function() {
      S("#monitor_2").visible();

      FuncUnit.wait(500, function() {
        pageHelper.verifyElementContent("#monitor_2",
          {
            '.monitor-title': "Test jenkins-monitor",
            '.build-time': "28-08-2012 11:25:10",
            '.build-duration': "09:56",
            '.build-result': "failure",
            '.build-status': "building"
          }
        );
      });
    });
  });
  test("should create a new go build monitor", function() {
    jashboardFeatureHelper.openMonitorDialog("dashboard_1");
    jashboardFeatureHelper.inputGenericMonitorData({
      monitorName: "Test go-monitor",
      monitorRefresh: "30",
      monitorType: "build"
    });
    inputBuildMonitorData({
      configurationType: "go",
      serverName: "go-server",
      serverPort: "1234",
      pipeline: "test-pipeline",
      stage: "test-stage",
      job: "test-job"
    });

    S("#configuration-save").visible().click();

    S("#dashboard_1 .monitor-panel").size(2, function() {
      S("#monitor_2").visible();

      FuncUnit.wait(500, function() {
        pageHelper.verifyElementContent("#monitor_2",
          {
            '.monitor-title': "Test go-monitor",
            '.build-time': "28-08-2012 11:25:10",
            '.build-duration': "09:56",
            '.build-result': "failure",
            '.build-status': "building"
          }
        );
      });
    });
  });
  test("Build monitor form fields validation", function() {
    jashboardFeatureHelper.openMonitorDialog("dashboard_1");
    jashboardFeatureHelper.inputGenericMonitorData({
      monitorName: "Test jenkins-monitor",
      monitorRefresh: "30",
      monitorType: "build"
    });
    verifySaveButtonDisabled();

    S("#buildServerNameRequiredError").invisible("should not display error");
    S("#buildServerPortRequiredError").invisible("should not display error");
    S("#buildServerPortNumberError").invisible("should not display error");
    pageHelper.inputText("input[name='serverName']", "test name");
    pageHelper.inputText("input[name='serverPort']", "123");
    
    pageHelper.verifyInputError(
      {inputName: "serverName", inputValue: ""},
      {errorSelector: "#buildServerNameRequiredError", errorMessage: "You must provide a CI server name."},
      verifySaveButtonDisabled
    );
    pageHelper.inputText("input[name='serverName']", "test name");
    pageHelper.verifyInputError(
      {inputName: "serverPort", inputValue: ""},
      {errorSelector: "#buildServerPortRequiredError", errorMessage: "You must provide a CI server port."},
      verifySaveButtonDisabled
    );
    pageHelper.verifyInputError(
      {inputName: "serverPort", inputValue: "abc"},
      {errorSelector: "#buildServerPortNumberError", errorMessage: "You must enter a valid port number."},
      verifySaveButtonDisabled
    );

    pageHelper.inputText("input[name='jenkins_build_id']", "test_build_id");
    pageHelper.verifyInputError(
      {inputName: "jenkins_build_id", inputValue: ""},
      {errorSelector: "#jenkinsBuildIdRequiredError", errorMessage: "You must provide a Jenkins build id."},
      verifySaveButtonDisabled
    );

    S("#ciServerType-go-tab").visible().click();
    pageHelper.inputText("input[name='go_pipeline']", "test_pipeline");
    pageHelper.verifyInputError(
      {inputName: "go_pipeline", inputValue: ""},
      {errorSelector: "#goPipelineRequiredError", errorMessage: "You must provide a Go pipeline."},
      verifySaveButtonDisabled
    );
    pageHelper.inputText("input[name='go_stage']", "test_stage");
    pageHelper.verifyInputError(
      {inputName: "go_stage", inputValue: ""},
      {errorSelector: "#goStageRequiredError", errorMessage: "You must provide a Go stage."},
      verifySaveButtonDisabled
    );
    pageHelper.inputText("input[name='go_job']", "test_job");
    pageHelper.verifyInputError(
      {inputName: "go_job", inputValue: ""},
      {errorSelector: "#goJobRequiredError", errorMessage: "You must provide a Go job."},
      verifySaveButtonDisabled
    );
  });
});

