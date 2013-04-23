(function(module) {
  jashboard.angular = _.extend(module, {
    tooltipDirective: function() {
      return function(scope, element, attrs) {
        var targetSelector = scope.$eval(attrs.jbTooltip);
        var tooltip = new jashboard.widgets.Tooltip(targetSelector, element);

        scope.$watch(attrs.jbTooltipToggle, function(newCondition, oldCondition) {
          if (newCondition !== oldCondition) {
            if (newCondition === true) {
              tooltip.show();
            } else if (newCondition === false) {
              tooltip.hide();
            }
          }
        });
      };
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbTooltip", [jashboard.angular.tooltipDirective]).run(function($log) {
  $log.info("tooltipDirective initialized");
});