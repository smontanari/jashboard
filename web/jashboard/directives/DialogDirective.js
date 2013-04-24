(function(module) {
  jashboard.angular = _.extend(module, {
    dialogDirective: function (dialogService) {
      return new jashboard.angular.EventDirectiveDefinition("jbDialog", function(scope, element) {
        return {
          show: function() {
            dialogService.showModal(element);
          },
          hide: function() {
            dialogService.hideModal(element);
          }
        };
      });
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbDialog", ['DialogService', jashboard.angular.dialogDirective]).run(function($log) {
  $log.info("dialogDirective initialized");
});