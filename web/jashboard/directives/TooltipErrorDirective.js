(function(module) {
  jashboard.angular = _.extend(module, {
    tooltipErrorDirective: function() {
      return {
        restrict: 'E',
        templateUrl: 'html/templates/tooltip_error.html',
        scope: {
          tooltipMessage: '=message',
          toggleStatus: '&toggle'
        },
        link: function(scope, element, attrs) {
          var targetSelector = angular.element(element).parent();
          var tooltip = new jashboard.widgets.Tooltip(targetSelector, element);
          scope.$watch(scope.toggleStatus, function(newCondition, oldCondition) {
            if (newCondition !== oldCondition) {
              if (newCondition === true) {
                tooltip.show();
              } else if (newCondition === false) {
                tooltip.hide();
              }
            }
          });
        }
      };
    }
  });
  jashboard.application.directive("jbTooltipError", [jashboard.angular.tooltipErrorDirective])
  .run(['$log', function(log) {
    log.info("tooltipErrorDirective initialized");
  }]);
}(jashboard.angular || {}));
