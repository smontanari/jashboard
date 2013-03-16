(function(module) {
  jashboard.angular = _.extend(module, {
    tooltipTargetDirective: function (tooltipService) {
      return function(scope, element, attrs) {
        var key = scope.$eval(attrs['jbTooltipTarget']);
        tooltipService.bindAs(element, key);
      };
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbTooltipTarget", ['TooltipService', jashboard.angular.tooltipTargetDirective]).run(function() {
  steal.dev.log("TooltipTargetDirective initialized");
});