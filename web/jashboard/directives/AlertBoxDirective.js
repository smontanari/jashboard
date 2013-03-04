(function(module) {
  jashboard.angular = _.extend(module, {
    alertBoxDirective: function (alertService) {
      return {
        scope: {},
        link: function(scope, element, attrs) {
          alertService.bindTo(element);
        }
      };
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbAlertBox", ['AlertService', jashboard.angular.alertBoxDirective]).run(function() {
  steal.dev.log("alertBoxDirective initialized");
});