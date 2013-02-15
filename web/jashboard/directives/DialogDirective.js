jashboard.defineModule("jashboard.angular", function() {
  jashboard.angular.dialogDirective = function factory(dialogService) {
    return new jashboard.angular.EventDirectiveDefinition("jbDialog", function(element) {
      return {
        show: function() {
          dialogService.showModal(element);
        },
        hide: function() {
          dialogService.hideModal(element);
        }
      };
    });
  };
});

jashboard.application.directive("jbDialog", ['DialogService', jashboard.angular.dialogDirective]).run(function() {
  steal.dev.log("dialogDirective initialized");
});