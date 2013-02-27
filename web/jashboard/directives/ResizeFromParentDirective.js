(function(module) {
  jashboard.angular = _.extend(module, {
    resizeFromParentDirective: function (widgetService) {
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbResizeFromParent", ['WidgetService', jashboard.angular.resizeFromParentDirective]).run(function() {
  steal.dev.log("resizeFromParentDirective initialized");
});