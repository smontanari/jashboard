(function(module) {
  jashboard.angular = _.extend(module, {
    slideShowDirective: function(paginationService) {
      return function(scope, element, attrs) {
        var attributes = scope.$eval(attrs.jbSlideShow);
        var startEvent = attributes.start;
        var slideShowStarted = false;

        var resetSlides = function(items, itemsPerSlide) {
          if (items) {
            stopSlideShow();
            scope.slides = paginationService.paginate(items, itemsPerSlide);
          }        
        };
        var stopSlideShow = function() {
          if (slideShowStarted) {
            $(element).cycle('destroy');
            slideShowStarted = false;
          }
        };
        var startSlideShow = function() {
          var interval = scope.$eval(attrs.jbSlideShowInterval);
          if (!slideShowStarted) {
            _.defer(function() {
              $(element).cycle({timeout: interval});
              slideShowStarted = true;
            });
          }
        };

        scope.$on(startEvent, function(event) {
          if (scope.slides && scope.slides.length > 1) {
            startSlideShow();
          }
          event.stopPropagation();
        });
        scope.$watch(attrs.jbSlideShowItems, function(newItems, oldItems) {
          if (newItems) {
            resetSlides(newItems, scope.$eval(attrs.jbSlideShowItemsPerSlide));
          }
        });
        scope.$watch(attrs.jbSlideShowItemsPerSlide, function(newPageSize, oldPageSize) {
          if (newPageSize) {
            resetSlides(scope.$eval(attrs.jbSlideShowItems), newPageSize);
          }
        });
        scope.$watch(attrs.jbSlideShowInterval, function(newInterval, oldInterval) {
          if (newInterval) {
            stopSlideShow();
            startSlideShow();
          }
        });

        resetSlides(scope.$eval(attrs.jbSlideShowItems), scope.$eval(attrs.jbSlideShowItemsPerSlide));
      };
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbSlideShow", ["PaginationService", jashboard.angular.slideShowDirective]).run(function($log) {
  $log.info("slideShowDirective initialized");
});