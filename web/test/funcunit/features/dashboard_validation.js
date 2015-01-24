funcunitHelper.testFeature("Dashboard validation", "dashboard_actions", function() {
  var saveButton = "#saveDashboard";
  var errorMessageSelector = "#dashboardNameRequiredError";
  var verifyDashboardNameError = function() {
    pageHelper.verifyInputError(
      {inputName: "dashboardName", inputValue: ""},
      {errorSelector: errorMessageSelector, errorMessage: "You must provide a dashboard name."},
      function() {
        pageHelper.verifyElementDisabled(saveButton, "the Save button is disabled");
      }
    );
  };
  this.createTest("it validates the name when creating a dashboard", function() {
    jashboardFeatureHelper.openDashboardDialog();

    pageHelper.verifyElementDisabled("#saveDashboard", "the Save button is disabled");
    F(errorMessageSelector).invisible("does not display error");

    pageHelper.inputText("dashboardName", "test name");
    pageHelper.verifyElementEnabled(saveButton, "the Save button is enabled");

    verifyDashboardNameError();
  });

  this.createTest("it validates the name when editing a dashboard", function() {
    jashboardFeatureHelper.triggerDashboardAction("#dashboard_1", "edit");

    F(errorMessageSelector).invisible("does not display error");
    pageHelper.verifyElementEnabled(saveButton, "the Save button is enabled");

    verifyDashboardNameError();
  });
});