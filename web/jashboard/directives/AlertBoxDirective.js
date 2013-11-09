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
  
  jashboard.application.directive("jbAlertBox", ['AlertService', jashboard.angular.alertBoxDirective])
  .run(['$log', function(log) {
    log.info("alertBoxDirective initialized");
  }]);
}(jashboard.angular || {}));

