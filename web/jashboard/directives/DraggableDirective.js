(function(module) {
  jashboard.angular = _.extend(module, {
    draggableDirective: function (widgetService) {
      return function(scope, element, attrs) {
        var draggableOptions = scope.$eval(attrs['jbDraggable']);
        
        if (_.isObject(draggableOptions)) {
          var options = {
            handle: draggableOptions.handleSelector
          };
          if (_.isString(draggableOptions.onDragStop)) {
            options.stop = function(event, ui) {
              scope.$emit(draggableOptions.onDragStop, event.target, ui.position);
            };
          }
        }

        widgetService.makeDraggable(element, options);
      };
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbDraggable", ['WidgetService', jashboard.angular.draggableDirective]).run(function() {
  steal.dev.log("draggableDirective initialized");
});