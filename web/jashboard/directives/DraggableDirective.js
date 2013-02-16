jashboard.defineModule("jashboard.angular", function() {
  jashboard.angular.draggableDirective = function factory(widgetService) {
    return function(scope, element, attrs) {
      widgetService.makeDraggable(element, attrs["jbDraggable"]);
    };
  };
});

jashboard.application.directive("jbDraggable", ['WidgetService', jashboard.angular.draggableDirective]).run(function() {
  steal.dev.log("draggableDirective initialized");
});