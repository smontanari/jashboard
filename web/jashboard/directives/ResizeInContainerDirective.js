(function(module) {
  jashboard.angular = _.extend(module, {
    resizeInContainerDirective: function () {
      return function(scope, element, attrs) {
        if (_.isObject(scope.monitor.size)) {
          var h = scope.monitor.size.height;
          var container = $(element);
          scope.$on("DataLoadingComplete", function(event) {
            scope.$evalAsync(function() {
              var position = container.position();
              var totalOffset = container.outerHeight() - container.height() + position.top;
              container.height(container.height() - totalOffset);
            });
          });
        }
      };
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbContainSize", [jashboard.angular.resizeInContainerDirective]).run(function() {
  steal.dev.log("resizeInContainerDirective initialized");
});