var vcsMonitorFeatureHelper = (function(helper) {
  var monitorTypeConfigurationInput = {
    git: function(data) {}
  };
  helper.inputVcsMonitorData = function(newMonitor, data) {
    pageHelper.inputText("vcsWorkingDir", data.vcsWorkingDir);
    pageHelper.inputText("vcsBranch", data.vcsBranch);
    pageHelper.inputText("vcsHistoryLength", data.vcsHistoryLength);
    if (!_.isUndefined(data.vcsPageSlideShow)) {
      pageHelper.toggleInput("vcsPageSlideShow", data.vcsPageSlideShow);
      if (data.vcsPageSlideShow) {
        pageHelper.inputText("vcsPageSize", data.vcsPageSize);
      }
    }
    // monitorTypeConfigurationInput[data.configurationType](data);
  };

  helper.verifyVcsFormValidationErrors = function(ciServerType) {
    // var verifySaveButtonDisabled = function() {
    //   pageHelper.verifyElementDisabled("#configuration-save", "the Save button should be disabled");
    // };
    // var verifyCIServerConfigErrors = {
    //   jenkins: function() {
    //     pageHelper.inputText("jenkinsBuildId", "test_build_id");
    //     pageHelper.verifyInputError(
    //       {inputName: "jenkinsBuildId", inputValue: ""},
    //       {errorSelector: "#jenkinsBuildIdRequiredError", errorMessage: "You must provide a Jenkins build id."},
    //       verifySaveButtonDisabled
    //     );
    //   },
    //   go: function() {
    //     pageHelper.inputText("goPipeline", "test_pipeline");
    //     pageHelper.verifyInputError(
    //       {inputName: "goPipeline", inputValue: ""},
    //       {errorSelector: "#goPipelineRequiredError", errorMessage: "You must provide a Go pipeline."},
    //       verifySaveButtonDisabled
    //     );
    //     pageHelper.inputText("goStage", "test_stage");
    //     pageHelper.verifyInputError(
    //       {inputName: "goStage", inputValue: ""},
    //       {errorSelector: "#goStageRequiredError", errorMessage: "You must provide a Go stage."},
    //       verifySaveButtonDisabled
    //     );
    //     pageHelper.inputText("goJob", "test_job");
    //     pageHelper.verifyInputError(
    //       {inputName: "goJob", inputValue: ""},
    //       {errorSelector: "#goJobRequiredError", errorMessage: "You must provide a Go job."},
    //       verifySaveButtonDisabled
    //     );
    //   }
    // };

    // pageHelper.verifyInputError(
    //   {inputName: "buildServerName", inputValue: ""},
    //   {errorSelector: "#buildServerNameRequiredError", errorMessage: "You must provide a CI server name."},
    //   verifySaveButtonDisabled
    // );
    // pageHelper.inputText("buildServerName", "test name");
    // pageHelper.verifyInputError(
    //   {inputName: "buildServerPort", inputValue: ""},
    //   {errorSelector: "#buildServerPortRequiredError", errorMessage: "You must provide a CI server port."},
    //   verifySaveButtonDisabled
    // );
    // pageHelper.verifyInputError(
    //   {inputName: "buildServerPort", inputValue: "abc"},
    //   {errorSelector: "#buildServerPortNumberError", errorMessage: "You must enter a valid port number."},
    //   verifySaveButtonDisabled
    // );

    // verifyCIServerConfigErrors[ciServerType]();
  };

  return helper;
}(vcsMonitorFeatureHelper || {}));
