(function(module) {
  jashboard = _.extend(module, {
    PaginationService: function() {
      this.paginate = function(items, pageSize) {
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
    }
  });
  jashboard.services.service('PaginationService', [jashboard.PaginationService]).run(function() {
    steal.dev.log("PaginationService initialized");
  });
}(jashboard || {}));
