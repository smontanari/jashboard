var buildMonitorFeatureHelper = (function(helper) {
  var monitorTypeConfigurationInput = {
    jenkins: function(data) {
      pageHelper.inputText("jenkinsBuildId", data.buildId);
    },
    go: function(data) {
      pageHelper.inputText("goPipeline", data.pipeline);
      pageHelper.inputText("goStage", data.stage);
      pageHelper.inputText("goJob", data.job);
    }
  };
  helper.inputBuildMonitorData = function(newMonitor, data) {
    pageHelper.inputText("buildServerName", data.buildServerName);
    pageHelper.inputText("buildServerPort", data.buildServerPort);
    if (newMonitor) {
      S("#ciServerType-" + data.configurationType + "-tab").visible().click();
    }
    monitorTypeConfigurationInput[data.configurationType](data);
  };

  helper.verifyBuildFormValidationErrors = function(ciServerType) {
    var verifySaveButtonDisabled = function() {
      pageHelper.verifyElementDisabled("#configuration-save", "the Save button should be disabled");
    };
    var verifyCIServerConfigErrors = {
      jenkins: function() {
        pageHelper.inputText("jenkinsBuildId", "test_build_id");
        pageHelper.verifyInputError(
          {inputName: "jenkinsBuildId", inputValue: ""},
          {errorSelector: "#jenkinsBuildIdRequiredError", errorMessage: "You must provide a Jenkins build id."},
          verifySaveButtonDisabled
        );
      },
      go: function() {
        pageHelper.inputText("goPipeline", "test_pipeline");
        pageHelper.verifyInputError(
          {inputName: "goPipeline", inputValue: ""},
          {errorSelector: "#goPipelineRequiredError", errorMessage: "You must provide a Go pipeline."},
          verifySaveButtonDisabled
        );
        pageHelper.inputText("goStage", "test_stage");
        pageHelper.verifyInputError(
          {inputName: "goStage", inputValue: ""},
          {errorSelector: "#goStageRequiredError", errorMessage: "You must provide a Go stage."},
          verifySaveButtonDisabled
        );
      }
    };
    
    pageHelper.verifyInputError(
      {inputName: "buildServerName", inputValue: ""},
      {errorSelector: "#buildServerNameRequiredError", errorMessage: "You must provide a CI server name."},
      verifySaveButtonDisabled
    );
    pageHelper.inputText("buildServerName", "test name");
    pageHelper.verifyInputError(
      {inputName: "buildServerPort", inputValue: ""},
      {errorSelector: "#buildServerPortRequiredError", errorMessage: "You must provide a CI server port."},
      verifySaveButtonDisabled
    );
    pageHelper.verifyInputError(
      {inputName: "buildServerPort", inputValue: "abc"},
      {errorSelector: "#buildServerPortNumberError", errorMessage: "You must enter a valid port number."},
      verifySaveButtonDisabled
    );

    verifyCIServerConfigErrors[ciServerType]();
  };

  return helper;
}(buildMonitorFeatureHelper || {}));
