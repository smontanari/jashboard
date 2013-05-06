(function(module) {
  jashboard.angular = _.extend(module, {
    dialogDirective: function (dialogService) {
      return function(scope, element, attrs) {
        var notifyWhenVisible = function() {
          scope.$broadcast("DialogVisible");
        };

        var eventsMap = scope.$eval(attrs.jbDialog);
        var actionsMap = {
          show: function() {
            dialogService.showModal(element, notifyWhenVisible);
          },
          hide: function() {
            dialogService.hideModal(element);
          }
        };
        
        jashboard.angularUtils.mapEventActions(scope, eventsMap, actionsMap);
      };
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbDialog", ['DialogService', jashboard.angular.dialogDirective]).run(function($log) {
  $log.info("dialogDirective initialized");
});