(function(module) {
  jashboard.angular = _.extend(module, {
    draggableDirective: function (widgetService) {
      return function(scope, element, attrs) {
        var directiveOptions = scope.$eval(attrs.jbDraggable);
        var options = {};

        if (_.isObject(directiveOptions)) {
          options.handle = directiveOptions.handleSelector;
          options.stack = directiveOptions.stackSelector;

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
  jashboard.application.directive("jbDraggable", ['WidgetService', jashboard.angular.draggableDirective])
  .run(['$log', function(log) {
    log.info("draggableDirective initialized");
  }]);
}(jashboard.angular || {}));
