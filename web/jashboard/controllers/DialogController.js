jashboard.DialogController = function(scope) {
  var closeDialog = function() {
    $(this).dialog("close");
  };

  scope.initDashboardFormDialog = function() {
    var dialogOptions = {autoOpen: false, modal: true, resizable: false, width: 500, height: 200, buttons: [
      {
        text: "Save",
        id: "saveDashboard"
      }
    ]};
    jQuery(jashboard.constants.dashboardFormSelector).dialog(dialogOptions);
  };

  scope.initMonitorFormDialog = function() {
    scope.newMonitor = {};
    var dialogOptions = {autoOpen: false, modal: true, resizable: false, width: 500, height: 400, buttons: [
      {
        text: "Save"
      },
      {
        text: "Cancel",
        click: closeDialog
      }
    ]};
    jQuery(jashboard.constants.monitorFormSelector).dialog(dialogOptions);
  };
};
jashboard.application.controller("DialogController", ['$scope', jashboard.DialogController]).run(function() {
  steal.dev.log("DialogController initialized");
});

