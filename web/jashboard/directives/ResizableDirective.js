(function(module) {
  jashboard.angular = _.extend(module, {
    resizableDirective: function (widgetService) {
      return function(scope, element, attrs) {
        var directiveOptions = scope.$eval(attrs['jbResizable']);
        var options = {};
        if(_.isObject(directiveOptions)) {
          if (_.isString(directiveOptions.onResizeStop)) {
            options.stop = function(event, ui) {
              var size = {
                width: ui.element.width(),
                height: ui.element.height()
              }
              scope.$emit(directiveOptions.onResizeStop, size);
            };
          }
          if (_.isString(directiveOptions.resizeChildren)) {
            options.alsoResize = angular.element(element).children(directiveOptions.resizeChildren);
          }
        }
        
        widgetService.makeResizable(element, options);
      };
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbResizable", ['WidgetService', jashboard.angular.resizableDirective]).run(function() {
  steal.dev.log("resizableDirective initialized");
});