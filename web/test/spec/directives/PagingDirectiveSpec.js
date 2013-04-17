describe("PagingDirective", function() {
  var linkFunction, scope, items;

  beforeEach(function() {
    scope = {
      $eval: sinon.stub()
    };

    linkFunction = jashboard.angular.pagingDirective();
  });

  it("should define one page with all the items ", function() {
    items = [
      "item1",
      "item2",
      "item3",
    ];
    scope.$eval.withArgs("test_expr").returns({pageSize: 3, items: items});
    
    linkFunction(scope, "test-element", {"jbPaging": "test_expr"});

    expect(scope.pages).toEqual([{items: items}]);
  });
  it("should split the items bewtween two pages ", function() {
    items = [
      "item1",
      "item2",
      "item3",
      "item4",
      "item5"
    ];
    scope.$eval.withArgs("test_expr").returns({pageSize: 3, items: items});
    
    linkFunction(scope, "test-element", {"jbPaging": "test_expr"});

    expect(scope.pages).toEqual([
      {items: ["item1", "item2", "item3"]},
      {items: ["item4", "item5"]}
    ]);
  });
});
