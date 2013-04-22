describe("PagingDirective", function() {
  var linkFunction, scope, itemsWatcherFn, pageSizeWatcherFn, paginationService;

  beforeEach(function() {
    scope = {
      $eval: sinon.stub(),
      $watch: jasmine.createSpy("scope.$watch").andCallFake(function(expr, callback) {
        if (expr === "test_expr_items") itemsWatcherFn = callback;
        if (expr === "test_expr_page_size") pageSizeWatcherFn = callback;
      })
    };
    paginationService = {
      paginate: sinon.stub()
    };
    scope.$eval.withArgs("test_expr_items").returns("items");
    scope.$eval.withArgs("test_expr_page_size").returns("page_size");
    paginationService.paginate.withArgs("items", "page_size").returns("test_pages");

    linkFunction = jashboard.angular.pagingDirective(paginationService);
  });
  
  it("should define the pages in the scope", function() {
    linkFunction(scope, "test-element", {jbPaging: "test_expr_items", jbPageSize: "test_expr_page_size"});

    expect(scope.pages).toEqual("test_pages");
  });

  it("should not define the pages in the scope if the items are undefined", function() {
    linkFunction(scope, "test-element", {jbPaging: "undefined_items", jbPageSize: "test_expr_page_size"});

    expect(paginationService.paginate).not.sinonStubToHaveBeenCalled();
  });

  describe("items watcher functionality", function() {
    beforeEach(function() {
      linkFunction(scope, "test-element", {jbPaging: "test_expr_items", jbPageSize: "test_expr_page_size"});
      paginationService.paginate.withArgs("new_items", "page_size").returns("test_new_pages");
    });
    it("should watch the expression representing the items", function() {
      expect(scope.$watch).toHaveBeenCalledWith("test_expr_items", jasmine.any(Function));
    });
    it("should not change the pages in the scope if the items are undefined", function() {
      itemsWatcherFn(undefined);

      expect(scope.pages).toEqual("test_pages");
    });
    it("should change the pages in the scope if the items are defined", function() {
      itemsWatcherFn("new_items");

      expect(scope.pages).toEqual("test_new_pages");
    });
  });

  describe("pageSize watcher functionality", function() {
    beforeEach(function() {
      linkFunction(scope, "test-element", {jbPaging: "test_expr_items", jbPageSize: "test_expr_page_size"});
      paginationService.paginate.withArgs("items", "new_page_size").returns("test_new_pages");
    });
    it("should watch the expression representing the items", function() {
      expect(scope.$watch).toHaveBeenCalledWith("test_expr_page_size", jasmine.any(Function));
    });
    it("should not change the pages in the scope if the pageSize is not defined", function() {
      pageSizeWatcherFn(undefined);

      expect(scope.pages).toEqual("test_pages");
    });
    it("should change the pages in the scope if the pageSize is defined", function() {
      pageSizeWatcherFn("new_page_size");

      expect(scope.pages).toEqual("test_new_pages");
    });
  });
});
