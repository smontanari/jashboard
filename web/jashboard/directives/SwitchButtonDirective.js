(function(module) {
  jashboard.angular = _.extend(module, {
    switchButtonDirective: function (widgetService) {
      return {
        replace: true,
        template: '<div><input type="checkbox"></div>',
        link: function(scope, element, attrs) {
          var toggle = function(event) {
            scope.$eval(attrs.ngModel + "=" + angular.element(event.target).is(":checked"));
            jashboard.angularUtils.safeApply(scope, attrs.jbSwitchButtonToggle);
          };
          var inputElement = angular.element(element).find("input");
          inputElement.attr("id", attrs.jbSwitchButtonId);
          inputElement.attr("name", attrs.jbSwitchButtonId);
          var removeWatcher = scope.$watch(attrs.ngModel, function(newValue, oldValue) {
            if (newValue !== oldValue && _.isUndefined(oldValue)) {
              widgetService.makeSwitchButton(element, newValue, toggle);
              removeWatcher();
            }
          });
          scope.$on("OpenMonitorDialog", function(event) {
            $(element).bootstrapSwitch('setState', scope.$eval(attrs.ngModel));
          });
        }
      };
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbSwitchButton", ['WidgetService', jashboard.angular.switchButtonDirective]).run(function() {
  steal.dev.log("switchButtonDirective initialized");
});