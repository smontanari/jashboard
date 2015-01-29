var jashboardFeatureHelper = (function(helper) {
  helper.openDashboardDialog = function() {
    F("#navbarMenu .menuAction-new-dashboard").visible("display new dashboard menu action link").click();
    F("#dashboard-form").visible("show new dashboard input dialog");
  };

  helper.triggerMonitorAction = function(monitor_id, action) {
    F(monitor_id + " .monitor-action.action-" + action).visible("display " + action + " action").click();
  };

  helper.triggerDashboardAction = function(dashboard_id, action) {
    F(dashboard_id + " .dashboard-action.action-" + action).visible("display " + action + " action").click();
  };

  helper.openMonitorDialog = function(dashboard_id) {
    F("#" + dashboard_id + " .dashboard-action.action-new").visible("display new monitor menu action").click();
    F("#monitor-form").visible("show new monitor modal");
  };

  helper.inputGenericMonitorData = function(data) {
    pageHelper.inputText("monitorName", data.monitorName);
    pageHelper.inputText("monitorRefresh", data.monitorRefresh);
    if (data.monitorType) {
      F("select[name='monitorType']").visible().click();
      F("select[name='monitorType'] option:contains('" + data.monitorType + "')").click();
    }
  };

  helper.confirmAlert = function() {
    F("#alertConfirm").visible().click();
  };

  helper.cancelAlert = function() {
    F("#alertCancel").visible().click();
  };

  helper.checkOverlayMessage = function(regexp, error) {
    var overlayClass = error ? "alert.alert-error" : "info";
    F(".overlay-msg." + overlayClass).visible("display overlay");
    F(".overlay-msg").text(regexp);
  };

  return helper;
}(jashboardFeatureHelper || {}));
