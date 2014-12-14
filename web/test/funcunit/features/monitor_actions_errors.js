funcunitHelper.testFeature("Monitor actions error handling", "monitor_errors", function() {
  this.createTest("should display an error when failing to create a monitor", function() {
    jashboardFeatureHelper.openMonitorDialog("dashboard_1");
    jashboardFeatureHelper.inputGenericMonitorData({
      monitorName: "Test monitor",
      monitorRefresh: "30",
      monitorType: "ipsum"
    });
    F("#configuration-next").visible().click();

    pageHelper.inputText("ipsumNumberOfSentences", "4");

    F("#configuration-save").visible().click();

    jashboardFeatureHelper.checkOverlayMessage(/Saving monitor/);

    jashboardFeatureHelper.checkOverlayMessage(/an error occurred/, true);
  });

  this.createTest("should display a warning icon with a tooltip when failing to refresh runtime information", function() {
    F("#monitor_1 .monitor-title .monitor-icon-ajax-loader").visible("the ajax loader is shown");
    F("#monitor_1 .monitor-title .monitor-icon-ajax-loader").invisible("the ajax loader is hidden");
    F("#monitor_1 .monitor-title .monitor-icon-ajax-error").visible("the ajax error is shown");
    F("#monitor_1 .monitor-title .monitor-icon-ajax-error").mouseover();
    F(".html-tooltip-error").visible(function() {
      ok(F(".html-tooltip-error").text().match(/something went very wrong/), "tooltip content should contain expected text");
    });
  });

  this.createTest("should display an error when failing to delete a monitor", function() {
    jashboardFeatureHelper.triggerMonitorAction("#monitor_3", "delete");

    jashboardFeatureHelper.confirmAlert();

    jashboardFeatureHelper.checkOverlayMessage(/Deleting monitor/);

    jashboardFeatureHelper.checkOverlayMessage(/an error occurred/, true);
  });
});