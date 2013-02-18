jashboard.defineModule("jashboard.angular", function() {
  jashboard.angular.draggableDirective = function (widgetService) {
    return function(scope, element, attrs) {
      var draggableOptions = scope.$eval(attrs['jbDraggable']);
      
      if (_.isObject(draggableOptions)) {
        var options = {
          handle: draggableOptions.handleSelector
        };
        if (_.isString(draggableOptions.onDragStopEvent)) {
          options.stop = function(event, ui) {
            scope.$emit(draggableOptions.onDragStopEvent, event.target, ui.position);
          };
        }
      }

      widgetService.makeDraggable(element, options);
    };
  };
});

jashboard.application.directive("jbDraggable", ['WidgetService', jashboard.angular.draggableDirective]).run(function() {
  steal.dev.log("draggableDirective initialized");
});