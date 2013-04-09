var jashboardFeatureHelper = (function(helper) {
  helper.openDashboardDialog = function() {
    S("#menuActions").click();
    S("#navbarMenu .menuAction-new-dashboard").visible("display new dashboard menu action link").click();
    S("#dashboard-form").visible("show new dashboard input dialog");
  };

  helper.triggerMonitorAction = function(monitor_id, action) {
    S(monitor_id + " .monitor-action.action-" + action).visible("display " + action + " action").click();
  };

  helper.triggerDashboardAction = function(dashboard_id, action) {
    S(dashboard_id + " .dashboard-action.action-" + action).visible("display " + action + " action").click();
  };

  helper.openMonitorDialog = function(dashboard_id) {
    S("#" + dashboard_id + " .dashboard-action.action-new").visible("display new monitor menu action").click();
    S("#monitor-form").visible("show new monitor modal");
  };

  helper.inputGenericMonitorData = function(data) {
    pageHelper.inputText("input[name='monitorName']", data.monitorName);
    pageHelper.inputText("input[name='monitorRefresh']", data.monitorRefresh);
    if (data.monitorType) {
      S("select[name='monitorType']").visible().click();
      S("select[name='monitorType'] option:contains('" + data.monitorType + "')").click();
    }
  };

  helper.confirmAlert = function() {
    S("#alertConfirm").visible().click();
  };

  helper.cancelAlert = function() {
    S("#alertCancel").visible().click();
  };

  helper.checkOverlayMessage = function(regexp, error) {
    var overlayClass = error ? "alert.alert-error" : "info";
    S(".overlay-msg." + overlayClass).visible("display overlay");
    S(".overlay-msg").text(regexp);
  };

  return helper;
}(jashboardFeatureHelper || {}));
