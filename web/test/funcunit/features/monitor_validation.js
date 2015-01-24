funcunitHelper.testFeature("Monitor validation", "display_dashboards_data", function() {
  this.createTest("it validates the monitor basic properties when creating a monitor", function() {
    jashboardFeatureHelper.openMonitorDialog("dashboard_1");
    pageHelper.verifyElementDisabled("#configuration-next", "the Next button is disabled");

    _.each(["#monitorNameRequiredError", "#monitorRefreshNumberError", "#monitorRefreshPositiveNumberError"], function (selector) {
      F(selector).invisible("does not display error");
    });

    pageHelper.inputText("monitorName", "test name");
    pageHelper.inputText("monitorRefresh", "123");

    pageHelper.verifyInputError(
      {inputName: "monitorName", inputValue: ""},
      {errorSelector: "#monitorNameRequiredError", errorMessage: "You must provide a monitor name."},
      function() {
        pageHelper.verifyElementDisabled("#configuration-next", "the Next button is disabled");
      }
    );
    pageHelper.inputText("monitorName", "test name");
    pageHelper.verifyInputError(
      {inputName: "monitorRefresh", inputValue: "abc"},
      {errorSelector: "#monitorRefreshNumberError", errorMessage: "You must enter a valid number."},
      function() {
        pageHelper.verifyElementDisabled("#configuration-next", "the Next button is disabled");
      }
    );
    pageHelper.inputText("monitorRefresh", "");
    pageHelper.verifyInputError(
      {inputName: "monitorRefresh", inputValue: "-98"},
      {errorSelector: "#monitorRefreshPositiveNumberError", errorMessage: "You must enter a positive number."},
      function() {
        pageHelper.verifyElementDisabled("#configuration-next", "the Next button is disabled");
      }
    );
  });

  this.createTest("it validates the monitor basic properties when editing a monitor", function() {
    jashboardFeatureHelper.triggerMonitorAction("#monitor_1", "edit");
    _.each(["#monitorNameRequiredError", "#monitorRefreshNumberError", "#monitorRefreshPositiveNumberError"], function (selector) {
      F(selector).invisible("does not display error");
    });
    pageHelper.verifyElementEnabled("#configuration-next", "the Next button is enabled");

    pageHelper.verifyInputError(
      {inputName: "monitorName", inputValue: ""},
      {errorSelector: "#monitorNameRequiredError", errorMessage: "You must provide a monitor name."},
      function() {
        pageHelper.verifyElementDisabled("#configuration-next", "the Next button is disabled");
      }
    );
    pageHelper.inputText("monitorName", "test name");

    pageHelper.verifyInputError(
      {inputName: "monitorRefresh", inputValue: "abc"},
      {errorSelector: "#monitorRefreshNumberError", errorMessage: "You must enter a valid number."},
      function() {
        pageHelper.verifyElementDisabled("#configuration-next", "the Next button is disabled");
      }
    );
  });
});
