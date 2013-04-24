(function(module) {
  jashboard = _.extend(module, {
    PaginationService: function() {
      this.paginate = function(items, pageSize) {
        if (_.isUndefined(pageSize) || _.isNull(pageSize) || _.isNaN(pageSize) || pageSize === 0) {
          pageSize = items.length;
        }
        var pages = [];
        var numberOfPages = Math.floor(items.length/pageSize);
        var numberOfItemsOnLastPage = items.length % pageSize;
        for (var i = 0, remainingItems = items; i < numberOfPages; i++) {
          pages.push({
            items: _.first(remainingItems, pageSize)
          });
          remainingItems = _.rest(remainingItems, pageSize);
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
  jashboard.services.service('PaginationService', [jashboard.PaginationService]).run(function($log) {
    $log.info("PaginationService initialized");
  });
}(jashboard || {}));
