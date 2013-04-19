(function(module) {
  jashboard.angular = _.extend(module, {
    switchButtonDirective: function() {
      return {
        replace: true,
        template: '<div><input type="checkbox"></div>',
        link: function(scope, element, attrs) {
          var toggle = function(event) {
            scope.$eval(attrs.ngModel + "=" + angular.element(event.target).is(":checked"));
            jashboard.angularUtils.safeApply(scope, attrs.jbSwitchButtonToggle);
          };
          var setWidgetState = function(widget) {
            var state = scope.$eval(attrs.ngModel) ? "setOn" : "setOff";
            widget[state]();
          };
          var inputElement = angular.element(element).find("input");
          inputElement.attr("id", attrs.jbSwitchButtonId);
          inputElement.attr("name", attrs.jbSwitchButtonId);
          var switchButton = new jashboard.widgets.SwitchButton(element, toggle);
          var attributes = scope.$eval(attrs.jbSwitchButton);

          if (_.isObject(attributes) && attributes.activateOn) {
            scope.$on(attributes.activateOn, function(event) {
              setWidgetState(switchButton);
            });
          } else {
            setWidgetState(switchButton);
          }
        }
      };
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbSwitchButton", [jashboard.angular.switchButtonDirective]).run(function() {
  steal.dev.log("switchButtonDirective initialized");
});