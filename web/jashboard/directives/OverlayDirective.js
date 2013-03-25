(function(module) {
  jashboard.angular = _.extend(module, {
    overlayDirective: function (overlayService) {
      return new jashboard.angular.EventDirectiveDefinition("jbOverlay", function(scope, element, attrs) {
        return {
          show: function() {
            overlayService.show(element, scope.$eval(attrs['jbOverlayOptions']));
          },
          hide: function() {
            overlayService.hide();
          }
        };
      });
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbOverlay", ['OverlayService', jashboard.angular.overlayDirective]).run(function() {
  steal.dev.log("overlayDirective initialized");
});