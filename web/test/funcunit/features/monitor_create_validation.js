funcunitHelper.testFeature("Monitor create validation", "display_dashboards_data", function() {
  test("Monitor name validation", function() {
    jashboardFeatureHelper.openMonitorDialog("dashboard_1");
    pageHelper.verifyElementDisabled("#configuration-next", "the Next button should be disabled");

    S("#monitorNameRequiredError").invisible("should not display error");
    pageHelper.inputText("input[name='monitorName']", "test name");
    
    pageHelper.verifyInputError(
      {inputName: "monitorName", inputValue: ""},
      {errorSelector: "#monitorNameRequiredError", errorMessage: "You must provide a monitor name."},
      function() {
        pageHelper.verifyElementDisabled("#configuration-next", "the Next button should be disabled");  
      }
    );
  });

  test("Monitor refresh interval validation", function() {
    jashboardFeatureHelper.openMonitorDialog("dashboard_1");
    pageHelper.inputText("input[name='monitorName']", "test name");

    S("#monitorRefreshRequiredError").invisible("should not display error");
    pageHelper.inputText("input[name='monitorRefresh']", "123");

    pageHelper.verifyInputError(
      {inputName: "monitorRefresh", inputValue: "abc"},
      {errorSelector: "#monitorRefreshRequiredError", errorMessage: "You must enter a valid number."},
      function() {
        pageHelper.verifyElementDisabled("#configuration-next", "the Next button should be disabled");  
      }
    );

    pageHelper.inputText("input[name='monitorRefresh']", "");
    pageHelper.verifyInputError(
      {inputName: "monitorRefresh", inputValue: "-98"},
      {errorSelector: "#monitorRefreshNumberError", errorMessage: "You must enter a positive number."},
      function() {
        pageHelper.verifyElementDisabled("#configuration-next", "the Next button should be disabled");  
      }
    );
  });
});
