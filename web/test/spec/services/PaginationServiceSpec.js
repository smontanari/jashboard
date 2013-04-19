describe("PaginationService", function() {
  var service;
  beforeEach(function() {
    service = new jashboard.PaginationService();
  });

  it("should define one page with all the items ", function() {
    items = [
      "item1",
      "item2",
      "item3",
    ];

    var pages = service.paginate(items, 3);

    expect(pages).toEqual([{items: items}]);
  });

  it("should split the items bewtween two pages ", function() {
    items = [
      "item1",
      "item2",
      "item3",
      "item4",
      "item5"
    ];

    var pages = service.paginate(items, 3);

    expect(pages).toEqual([
      {items: ["item1", "item2", "item3"]},
      {items: ["item4", "item5"]}
    ]);
  });
});