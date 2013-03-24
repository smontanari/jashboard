(function(module) {
  jashboard.angular = _.extend(module, {
    tooltipDirective: function (tooltipService) {
      return function(scope, element, attrs) {
        var targetSelector = scope.$eval(attrs.jbTooltip);
        var toggleExpression = attrs.jbTooltipToggle;
        scope.$watch(toggleExpression, function(newValue, oldValue) {
          if (newValue) {
            tooltipService.attachHtmlTooltip(targetSelector, element);
          } else {
            tooltipService.removeTooltip(targetSelector);
          }
        });
      };
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbTooltip", ['TooltipService', jashboard.angular.tooltipDirective]).run(function() {
  steal.dev.log("tooltipDirective initialized");
});