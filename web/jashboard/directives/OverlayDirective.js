(function(module) {
  jashboard.angular = _.extend(module, {
    overlayDirective: function (overlayService) {
      return function(scope, element, attrs) {
        var eventsMap = scope.$eval(attrs.jbOverlay);
        var actionsMap = {
          show: function() {
            overlayService.show(element, scope.$eval(attrs['jbOverlayOptions']));
          },
          hide: function() {
            overlayService.hide();
          }
        };

        jashboard.angularUtils.mapEventActions(scope, eventsMap, actionsMap);
      };
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbOverlay", ['OverlayService', jashboard.angular.overlayDirective]).run(function($log) {
  $log.info("overlayDirective initialized");
});