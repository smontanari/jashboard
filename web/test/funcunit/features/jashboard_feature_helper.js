var jashboardFeatureHelper = (function(helper) {
  helper.openDashboardDialog = function() {
    S("#menuActions").click();
    S("#navbarMenu .menuAction-new-dashboard").visible("display new dashboard menu action link").click();
    S("#new-dashboard-form").visible("show new dashboard input dialog");
  };

  helper.openMonitorDialog = function(dashboard_id) {
    S("#" + dashboard_id + "-actions").click();
    S("#" + dashboard_id + " .dashboard-actions a:contains('New Monitor')").visible("display new monitor menu action").click();
    S("#new-monitor-form").visible("show new monitor modal");
  };

  helper.inputGenericMonitorData = function(data) {
    pageHelper.inputText("input[name='monitorName']", data.monitorName);
    pageHelper.inputText("input[name='monitorRefresh']", data.monitorRefresh);
    S("select[name='monitorType']").visible().click();
    S("select[name='monitorType'] option:contains('" + data.monitorType + "')").click();
    S("#configuration-next").visible().click();
  };

  return helper;
}(jashboardFeatureHelper || {}));
