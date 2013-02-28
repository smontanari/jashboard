(function(module) {
  jashboard.angular = _.extend(module, {
    resizeFromParentDirective: function (widgetService) {
      return function(scope, element, attrs) {
        var eventName = attrs['jbResizeFromParent'];
        scope.$on(eventName, function(event, parentElement) {
          widgetService.resizeFromParent(element, parentElement);
        });
      };
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbResizeFromParent", ['WidgetService', jashboard.angular.resizeFromParentDirective]).run(function() {
  steal.dev.log("resizeFromParentDirective initialized");
});