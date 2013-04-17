(function(module) {
  jashboard.angular = _.extend(module, {
    pagingDirective: function () {
      return function(scope, element, attrs) {
        var attributes = scope.$eval(attrs['jbPaging']);
        var pages = [];
        var numberOfPages = Math.floor(attributes.items.length/attributes.pageSize);
        var numberOfItemsOnLastPage = attributes.items.length % attributes.pageSize;
        for (var i = 0; i < numberOfPages; i++) {
          pages.push({
            items: _.first(attributes.items, i * attributes.pageSize + attributes.pageSize)
          });
        };
        if (numberOfItemsOnLastPage > 0) {
          pages.push({
            items: _.last(attributes.items, numberOfItemsOnLastPage)
          });
        }

        scope.pages = pages;
      };
    }
  });
}(jashboard.angular || {}));

jashboard.application.directive("jbPaging", [jashboard.angular.pagingDirective]).run(function() {
  steal.dev.log("pagingDirective initialized");
});