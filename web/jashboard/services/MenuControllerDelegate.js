(function(module) {
  jashboard = _.extend(module, {
    MenuControllerDelegate: function() {
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
  jashboard.services.service('MenuControllerDelegate', [jashboard.MenuControllerDelegate]).run(function() {
    steal.dev.log("MenuControllerDelegate initialized");
  });
}(jashboard || {}));
