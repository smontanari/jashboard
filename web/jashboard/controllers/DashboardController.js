jashboard.DashboardController = function(scope) {
  scope.actionNewMonitor = function() {
    $(jashboard.constants.monitorFormSelector).dialog("open");
  };
};

jashboard.application.controller("DashboardController", ['$scope', jashboard.DashboardController]).run(function() {
  steal.dev.log("DashboardController initialized");
});

