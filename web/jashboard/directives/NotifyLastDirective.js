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
  jashboard.application.directive("jbNotifyLast", [jashboard.angular.notifyLastDirective])
  .run(['$log', function(log) {
    log.info("notifyLastDirective initialized");
  }]);
}(jashboard.angular || {}));
