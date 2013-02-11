jashboard.dialogDirective = function(dialogService) {
  return function(scope, element, attrs) {
    var actions = {
      show: function() {
        dialogService.showModal(element);
      },
      hide: function() {
        dialogService.hideModal(element);
      }
    };

    var eventMap = scope.$eval(attrs['jbDialog']);

    _.each(_.keys(eventMap), function(actionName) {
      scope.$on(eventMap[actionName], actions[actionName]);
    });
  };
};

jashboard.application.directive("jbDialog", ['DialogService', jashboard.dialogDirective]).run(function() {
  steal.dev.log("dialogDirective initialized");
});