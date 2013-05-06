(function(module) {
  jashboard.angular = _.extend(module, {
    focusDirective: function (widgetService) {
      return function(scope, element, attrs) {
        var map = scope.$eval(attrs.jbFocus);
        if (_.isString(map.triggerOnEvent)) {
          scope.$on(map.triggerOnEvent, function(event) {
            widgetService.setFocus(element);
          });
        }
      };
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbFocus", ['WidgetService', jashboard.angular.focusDirective]).run(function($log) {
  $log.info("focusDirective initialized");
});