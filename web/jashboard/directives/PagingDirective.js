(function(module) {
  jashboard.angular = _.extend(module, {
    pagingDirective: function(paginationService) {
      return function(scope, element, attrs) {
        var resetPages = function(items, pageSize) {
          if (items) {
            scope.pages = paginationService.paginate(items, pageSize);
          }        
        }
        resetPages(scope.$eval(attrs.jbPaging), scope.$eval(attrs.jbPageSize));

        scope.$watch(attrs.jbPaging, function(newItems, oldItems) {
          if (newItems) {
            resetPages(newItems, scope.$eval(attrs.jbPageSize));
          }
        });
        scope.$watch(attrs.jbPageSize, function(newPageSize, oldPageSize) {
          if (newPageSize) {
            resetPages(scope.$eval(attrs.jbPaging), newPageSize);
          }
        });
      };
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbPaging", ["PaginationService", jashboard.angular.pagingDirective]).run(function() {
  steal.dev.log("pagingDirective initialized");
});