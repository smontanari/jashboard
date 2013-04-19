(function(module) {
  jashboard.angular = _.extend(module, {
    slideShowDirective: function() {
      return function(scope, element, attrs) {
        var attributes = scope.$eval(attrs.jbSlideShow);
        var startEvent = attributes.start;

        scope.$on(startEvent, function(event) {
          $(element).cycle();
          event.stopPropagation();
        });
      };
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbSlideShow", [jashboard.angular.slideShowDirective]).run(function() {
  steal.dev.log("slideShowDirective initialized");
});