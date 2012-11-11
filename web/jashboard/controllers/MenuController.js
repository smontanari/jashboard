jashboard.MenuController = function(scope) {
  scope.actionNewDashboard = function() {
    $(jashboard.constants.dashboardFormSelector).dialog("open");
  };
};

jashboard.application.controller("MenuController", ['$scope', jashboard.MenuController]).run(function() {
  steal.dev.log("MenuController initialized");
});

