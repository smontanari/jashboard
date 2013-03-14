(function(module) {
  jashboard.angular = _.extend(module, {
    tooltipDirective: function (tooltipService) {
      return function(scope, element, attrs) {
        scope.$watch(attrs['jbTooltip'], function(newValue, oldValue) {
          if (_.isString(newValue)) {
            tooltipService.attachTextTooltip(element, newValue);
          } else if (!(newValue === oldValue)) {
            tooltipService.removeTooltip(element);
          }
        });
      };
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbTooltip", ['TooltipService', jashboard.angular.tooltipDirective]).run(function() {
  steal.dev.log("tooltipDirective initialized");
});