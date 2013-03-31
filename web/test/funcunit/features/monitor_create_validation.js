funcunitHelper.testFeature("Monitor create: initial form validation", "display_dashboards_data", function() {
  test("Monitor form fields validation", function() {
    jashboardFeatureHelper.openMonitorDialog("dashboard_1");
    pageHelper.verifyElementDisabled("#configuration-next", "the Next button should be disabled");

    S("#monitorNameRequiredError").invisible("should not display error");
    S("#monitorRefreshNumberError").invisible("should not display error");
    S("#monitorRefreshPositiveNumberError").invisible("should not display error");
    pageHelper.inputText("input[name='monitorName']", "test name");
    pageHelper.inputText("input[name='monitorRefresh']", "123");
    
    pageHelper.verifyInputError(
      {inputName: "monitorName", inputValue: ""},
      {errorSelector: "#monitorNameRequiredError", errorMessage: "You must provide a monitor name."},
      function() {
        pageHelper.verifyElementDisabled("#configuration-next", "the Next button should be disabled");  
      }
    );
    pageHelper.inputText("input[name='monitorName']", "test name");
    pageHelper.verifyInputError(
      {inputName: "monitorRefresh", inputValue: "abc"},
      {errorSelector: "#monitorRefreshNumberError", errorMessage: "You must enter a valid number."},
      function() {
        pageHelper.verifyElementDisabled("#configuration-next", "the Next button should be disabled");  
      }
    );
    pageHelper.inputText("input[name='monitorRefresh']", "");
    pageHelper.verifyInputError(
      {inputName: "monitorRefresh", inputValue: "-98"},
      {errorSelector: "#monitorRefreshPositiveNumberError", errorMessage: "You must enter a positive number."},
      function() {
        pageHelper.verifyElementDisabled("#configuration-next", "the Next button should be disabled");  
      }
    );
  });
});
