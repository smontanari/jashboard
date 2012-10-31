jashboard.MonitorController = function(scope) {
  scope.newMonitor = {};
  scope.initMonitorFormDialog = function() {
    var dialogOptions = {autoOpen: false, modal: true, resizable: false, width: 500, height: 400, buttons: [
      {
        text: "Save"
      },
      {
        text: "Cancel",
        click: function() { $(this).dialog("close"); }
      }
    ]};
    jQuery(jashboard.constants.monitorFormSelector).dialog(dialogOptions);
  };
};
jashboard.application.controller("MonitorController", ['$scope', jashboard.MonitorController]).run(function() {
  steal.dev.log("MonitorController initialized");
});

