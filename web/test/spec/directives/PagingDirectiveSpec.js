describe("PagingDirective", function() {
  var linkFunction, scope, watcherFn, paginationService;

  beforeEach(function() {
    scope = {
      $eval: sinon.stub(),
      $watch: jasmine.createSpy("scope.$watch").andCallFake(function(expr, callback) {
        watcherFn = callback;
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
    });
    it("should watch the expression representing the items", function() {
      expect(scope.$watch).toHaveBeenCalledWith("test_expr_items", jasmine.any(Function));
    });
    it("should not change the pages in the scope if the items are equal", function() {
      angular.equals = sinon.stub().withArgs("new_items", "old_items").returns(true);

      watcherFn("new_items", "old_items");

      expect(scope.pages).toEqual("test_pages");
    });
    it("should not change the pages in the scope if the items are undefined", function() {
      watcherFn(undefined, "old_items");

      expect(paginationService.paginate.callCount).toEqual(1);
    });
    it("should change the pages in the scope if the items are different", function() {
      angular.equals = sinon.stub().withArgs("new_items", "old_items").returns(false);
      paginationService.paginate.withArgs("new_items", "page_size").returns("test_new_pages");
      
      watcherFn("new_items", "old_items");

      expect(scope.pages).toEqual("test_new_pages");
    });
  });
});
