(function(module) {
  jashboard.angular = _.extend(module, {
    overlayDirective: function (overlayService) {
      return new jashboard.angular.EventDirectiveDefinition("jbOverlay", function(element) {
        return {
          show: function() {
            overlayService.show(element);
          },
          hide: function() {
            overlayService.hide(element);
          }
        };
      });
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbOverlay", ['OverlayService', jashboard.angular.overlayDirective]).run(function() {
  steal.dev.log("overlayDirective initialized");
});