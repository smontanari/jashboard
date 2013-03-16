(function(module) {
  jashboard.angular = _.extend(module, {
    tooltipDirective: function (tooltipService) {
      return new jashboard.angular.EventDirectiveDefinition("jbTooltip", function(scope, element, attrs) {
        var targetSelector = scope.$eval(attrs['jbTooltipFor']);
        return {
          show: function() {
            tooltipService.attachHtmlTooltip(targetSelector, element);
          },
          hide: function() {
            tooltipService.removeTooltip(targetSelector);
          }
        };
      });
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbTooltip", ['TooltipService', jashboard.angular.tooltipDirective]).run(function() {
  steal.dev.log("tooltipDirective initialized");
});