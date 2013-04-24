(function(module) {
  jashboard = _.extend(module, {
    MenuActionsHandler: function() {
      this.init = function(scope) {
        var menuActions = {
          newDashboard: function() {
            scope.$broadcast("OpenDashboardDialog", {mode: jashboard.inputOptions.createMode});
          }
        };
        scope.menuAction = function(name) {
          menuActions[name]();
        }
      };
    }
  });
  jashboard.services.service('MenuActionsHandler', [jashboard.MenuActionsHandler]).run(function($log) {
    $log.info("MenuActionsHandler initialized");
  });
}(jashboard || {}));
