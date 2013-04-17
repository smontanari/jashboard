(function(module) {
  jashboard.angular = _.extend(module, {
    slideShowDirective: function (widgetService) {
      return function(scope, element, attrs) {
        var attributes = scope.$eval(attrs.jbSlideShow);
        var triggerEvent = attributes.triggerOn;

        scope.$on(triggerEvent, function() {
          $(element).cycle();
        });
      };
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbSlideShow", ['WidgetService', jashboard.angular.slideShowDirective]).run(function() {
  steal.dev.log("slideShowDirective initialized");
});