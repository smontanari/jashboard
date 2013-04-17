(function(module) {
  jashboard.angular = _.extend(module, {
    pagingDirective: function () {
      var definePages = function(items, pageSize) {
        var pages = [];
        var numberOfPages = Math.floor(items.length/pageSize);
        var numberOfItemsOnLastPage = items.length % pageSize;
        for (var i = 0; i < numberOfPages; i++) {
          pages.push({
            items: _.first(items, i * pageSize + pageSize)
          });
        };
        if (numberOfItemsOnLastPage > 0) {
          pages.push({
            items: _.last(items, numberOfItemsOnLastPage)
          });
        }
        return pages;
      };
      return function(scope, element, attrs) {
        var attributes = scope.$eval(attrs['jbPaging']);
        
        scope.pages = definePages(attributes.items, attributes.pageSize);
      };
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbPaging", [jashboard.angular.pagingDirective]).run(function() {
  steal.dev.log("pagingDirective initialized");
});