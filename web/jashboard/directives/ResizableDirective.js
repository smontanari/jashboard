(function(module) {
  jashboard.angular = _.extend(module, {
    resizableDirective: function (widgetService) {
      return function(scope, element, attrs) {
        var directiveOptions = scope.$eval(attrs['jbResizable']);
        var options = {};
        var handleEvent = function(eventName, optionName, fireAction) {
          if (_.isString(eventName)) {
            options[optionName] = function(event, ui) {
              scope[fireAction](eventName, event.target, ui.size);
            };
          }
        };
        if (_.isObject(directiveOptions)) {
          handleEvent(directiveOptions.whenResizeStop, 'stop', '$emit');
          handleEvent(directiveOptions.whenResize, 'resize', '$broadcast');
        }

        widgetService.makeResizable(element, options);
      };
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbResizable", ['WidgetService', jashboard.angular.resizableDirective]).run(function() {
  steal.dev.log("resizableDirective initialized");
});