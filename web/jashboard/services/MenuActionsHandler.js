(function(module) {
  jashboard = _.extend(module, {
    MenuActionsHandler: function() {
      this.init = function(scope) {
        var menuActions = {
          newDashboard: function() {
            scope.$broadcast("OpenDashboardDialog");
          }
        };
        scope.menuAction = function(name) {
          menuActions[name]();
        }
      };
    }
  });
  jashboard.services.service('MenuActionsHandler', [jashboard.MenuActionsHandler]).run(function() {
    steal.dev.log("MenuActionsHandler initialized");
  });
}(jashboard || {}));
