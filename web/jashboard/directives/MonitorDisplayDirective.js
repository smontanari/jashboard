(function(module) {
  jashboard.angular = _.extend(module, {
    monitorDisplayDirective: function (widgetService) {
      return function(scope, element, attrs) {
        scope.resetSize = function() {
          if (_.isObject(scope.monitor.size)) {
            if ($(element).is(':visible')) {
              widgetService.resetContainerHeight(element);
            } else {
              var removelistener = scope.$on("DashboardVisible", function(event, dashboard_id) {
                if (scope.dashboard.id === dashboard_id) {
                  setTimeout(function() {
                    widgetService.resetContainerHeight(element);
                  }, 0);
                  removelistener();
                }
              });          
            }
          }
        };
      };
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbMonitorDisplay", ['WidgetService', jashboard.angular.monitorDisplayDirective]).run(function() {
  steal.dev.log("monitorDisplayDirective initialized");
});