(function(module) {
  jashboard.angular = _.extend(module, {
    slideShowDirective: function() {
      return function(scope, element, attrs) {
        var attributes = scope.$eval(attrs.jbSlideShow);
        var startEvent = attributes.start;
        var slideShowStarted = false;

        var stopSlideShow = function() {
          if (slideShowStarted) {
            $(element).cycle('stop');
            $(element).cycle('destroy');
            slideShowStarted = false;
          }
        };
        var startSlideShow = function() {
          _.defer(function() {
            $(element).cycle();
            slideShowStarted = true;
          });
        };

        scope.$on(startEvent, function(event) {
          stopSlideShow();
          startSlideShow();
          event.stopPropagation();
        });
      };
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbSlideShow", [jashboard.angular.slideShowDirective]).run(function() {
  steal.dev.log("slideShowDirective initialized");
});