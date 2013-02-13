jashboard.overlayDirective = function(overlayService) {
  return function(scope, element, attrs) {
    var actions = {
      show: function() {
        overlayService.show(element);
      },
      hide: function() {
        overlayService.hide(element);
      }
    };

    var eventMap = scope.$eval(attrs['jbOverlay']);

    _.each(_.keys(eventMap), function(actionName) {
      scope.$on(eventMap[actionName], actions[actionName]);
    });
  };
};

jashboard.application.directive("jbOverlay", ['OverlayService', jashboard.overlayDirective]).run(function() {
  steal.dev.log("overlayDirective initialized");
});