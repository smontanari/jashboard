(function(module) {
  jashboard.angular = _.extend(module, {
    switchButtonDirective: function() {
      return {
        restrict: 'E',
        replace: true,
        template: '<input id="{{attrId}}" name="{{attrId}}" class="{{attrClass}}" data-on="{{attrOn}}" type="checkbox">',
        scope: {
          attrId: '@id',
          attrOn: '@on',
          attrClass:'@class',
          state: '&value',
          toggle: '&'
        },
        link: function(scope, element, attrs) {
          var switchButton = null;
          var initButton = function() {
            var initialState = scope.state();
            if (_.isObject(switchButton)) {
              switchButton.reset(initialState);
            } else {
              switchButton = new jashboard.widgets.SwitchButton(element, initialState, scope.toggle);
            }
          };
          if (attrs.activateOn) {
            scope.$on(attrs.activateOn, initButton);
          } else {
            initButton();
          }
        }
      };
    }
  });
  jashboard.application.directive("jbSwitchButton", [jashboard.angular.switchButtonDirective])
  .run(['$log', function(log) {
    log.info("switchButtonDirective initialized");
  }]);
}(jashboard.angular || {}));
