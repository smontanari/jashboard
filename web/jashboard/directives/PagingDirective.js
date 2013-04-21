(function(module) {
  jashboard.angular = _.extend(module, {
    pagingDirective: function(paginationService) {
      return function(scope, element, attrs) {
        var pageSize = scope.$eval(attrs.jbPageSize);
        var items = scope.$eval(attrs.jbPaging);
        if (items) {
          scope.pages = paginationService.paginate(items, pageSize);
        }        
        scope.$watch(attrs.jbPaging, function(newItems, oldItems) {
          if (newItems && !angular.equals(newItems, oldItems)) {
            scope.pages = paginationService.paginate(newItems, pageSize);
          }
        });
      };
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbPaging", ["PaginationService", jashboard.angular.pagingDirective]).run(function() {
  steal.dev.log("pagingDirective initialized");
});