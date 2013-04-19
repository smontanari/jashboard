(function(module) {
  jashboard.angular = _.extend(module, {
    pagingDirective: function(paginationService) {
      return function(scope, element, attrs) {
        var items = scope.$eval(attrs.jbPaging);
        var pageSize = scope.$eval(attrs.jbPageSize);
        scope.pages = paginationService.paginate(items, pageSize);
        
        scope.$watch(attrs.jbPaging, function(newItems, oldItems) {
          if (!angular.equals(newItems, oldItems)) {
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