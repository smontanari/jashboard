funcunitHelper.testFeature("Monitor actions error handling", "monitor_errors", function() {
  test("should display an error when failing to create a monitor", function() {
    jashboardFeatureHelper.openMonitorDialog("dashboard_1");
    jashboardFeatureHelper.inputGenericMonitorData({
      monitorName: "Test monitor",
      monitorRefresh: "30",
      monitorType: "ipsum"
    });
    S("#configuration-next").visible().click();

    pageHelper.inputText("input[name='numberOfSentences']", "4");

    S("#configuration-save").visible().click();

    jashboardFeatureHelper.checkOverlayMessage(/Saving monitor/);

    jashboardFeatureHelper.checkOverlayMessage(/an error occurred/, true);
  });

  test("should display a warning icon with a tooltip when failing to refresh runtime information", function() {
    S("#monitor_1 .monitor-title .monitor-icon-ajax-loader").visible("the ajax loader is shown");
    S("#monitor_1 .monitor-title .monitor-icon-ajax-loader").invisible("the ajax loader is hidden");
    S("#monitor_1 .monitor-title .monitor-icon-ajax-error").visible("the ajax error is shown");
    S("#monitor_1 .monitor-title .monitor-icon-ajax-error").mouseover();
    S(".tooltip").visible(function() {
      ok(S(".tooltip").text().match(/something went very wrong/), "tooltip content should contain expected text");
    });
  });
  
  test("should display an error when failing to delete a monitor", function() {
    jashboardFeatureHelper.triggerMonitorAction("#monitor_3", "delete");
    
    jashboardFeatureHelper.confirmAlert();

    jashboardFeatureHelper.checkOverlayMessage(/Deleting monitor/);

    jashboardFeatureHelper.checkOverlayMessage(/an error occurred/, true);
  });  
});