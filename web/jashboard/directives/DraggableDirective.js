(function(module) {
  jashboard.angular = _.extend(module, {
    draggableDirective: function (widgetService) {
      return function(scope, element, attrs) {
        var directiveOptions = scope.$eval(attrs['jbDraggable']);
        
        if (_.isObject(directiveOptions)) {
          var options = {
            handle: directiveOptions.handleSelector,
            stack: directiveOptions.stackSelector
          };
          if (_.isString(directiveOptions.onDragStop)) {
            options.stop = function(event, ui) {
              scope.$emit(directiveOptions.onDragStop, ui.position);
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