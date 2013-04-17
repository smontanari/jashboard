(function(module) {
  jashboard.angular = _.extend(module, {
    notifyLastDirective: function () {
      return function(scope, element, attrs) {
        var eventName = attrs.jbNotifyLast;
        if (scope.$last) {
          scope.$emit(eventName);
        }
      };
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbNotifyLast", [jashboard.angular.notifyLastDirective]).run(function() {
  steal.dev.log("notifyLastDirective initialized");
});