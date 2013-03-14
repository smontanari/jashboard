(function(module) {
  jashboard.angular = _.extend(module, {
    tooltipDirective: function (tooltipService) {
      return function(scope, element, attrs) {
        var key = scope.$eval(attrs['jbTooltip']);
        tooltipService.bindAs(element, key);
      };
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbTooltip", ['TooltipService', jashboard.angular.tooltipDirective]).run(function() {
  steal.dev.log("tooltipDirective initialized");
});