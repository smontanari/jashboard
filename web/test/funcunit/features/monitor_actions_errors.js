funcunitHelper.testFeature("Error handling: monitor actions", "monitor_errors", function() {
  var openMonitorDialog = function() {
    S("#dashboard_1-actions").click();
    S("#dashboard_1 .dashboard-actions a:contains('New Monitor')").visible("display new monitor menu action").click();
    S("#new-monitor-form").visible("show new monitor modal");
  };
  var inputMonitorData = function(data) {
    featureHelper.inputText("input[name='monitorName']", data.monitorName);
    featureHelper.inputText("input[name='monitorRefresh']", data.monitorRefresh);
    S("select[name='monitorType']").visible().click();
    S("select[name='monitorType'] option:contains('" + data.monitorType + "')").click();
    S("#configuration-next").visible().click();
    featureHelper.inputText("input[name='numberOfSentences']", data.numberOfSentences);
  };

  test("should display an error when failing to create a monitor", function() {
    openMonitorDialog();
    inputMonitorData({
      monitorName: "Test monitor",
      monitorRefresh: "30",
      monitorType: "ipsum",
      numberOfSentences: "4"
    });

    S("#configuration-save").visible().click();

    S(".overlay-msg.info").visible("display overlay while saving dashboard");
    S(".overlay-msg.info").text(/Saving monitor/);

    S(".overlay-msg.alert.alert-error").visible("display error overlay");
    S(".overlay-msg").text(/an error occurred/);

  });

  test("should display a warning icon with a tolltip when failing to refresh runtime information", function() {
    S("#monitor_1 .monitor-title .monitor-icon-ajax-loader").visible("the ajax loader is shown");
    S("#monitor_1 .monitor-title .monitor-icon-ajax-loader").invisible("the ajax loader is hidden");
    S("#monitor_1 .monitor-title .monitor-icon-ajax-error").visible("the ajax error is shown");
    S("#monitor_1 .monitor-title .monitor-icon-ajax-error").mouseover();
    S(".tooltip").visible(function() {
      ok(S(".tooltip").text().match(/something went very wrong/), "tooltip content should contain expected text");
    });
  });
  
  test("should display an error when failing to create a monitor", function() {
    S("#monitor_3 .monitor-icon-delete").visible().click();
    
    S("#alertConfirm").visible().click();

    S(".overlay-msg.info").visible("display overlay while deleting dashboard");
    S(".overlay-msg.info").text(/Deleting monitor/);

    S(".overlay-msg.alert.alert-error").visible("display error overlay");
    S(".overlay-msg.alert.alert-error").text(/an error occurred/);
  });  
});