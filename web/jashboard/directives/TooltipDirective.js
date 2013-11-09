(function(module) {
  jashboard.angular = _.extend(module, {
    tooltipDirective: function() {
      return function(scope, element, attrs) {
        var targetSelector = scope.$eval(attrs.jbTooltip);
        var tooltip = new jashboard.widgets.Tooltip(targetSelector, element, attrs.jbTooltipClass);

        scope.$watch(attrs.jbTooltipToggle, function(newCondition, oldCondition) {
          if (newCondition !== oldCondition) {
            scope.$evalAsync(function() {
              if (newCondition === true) {
                tooltip.show();
              } else if (newCondition === false) {
                tooltip.hide();
              }
            });
          }
        });
      };
    }
  });
  jashboard.application.directive("jbTooltip", [jashboard.angular.tooltipDirective])
  .run(['$log', function(log) {
    log.info("tooltipDirective initialized");
  }]);
}(jashboard.angular || {}));
