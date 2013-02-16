describe("WidgetService", function() {
  var service;
  var $stub;

  beforeEach(function() {
    $stub = testHelper.stubJQuery(["test-selector"]);
    $stub.draggable = jasmine.createSpy("$.draggable()");
    service = new jashboard.WidgetService();
  });

  it("should invoke $.draggable()", function() {
    service.makeDraggable("test-selector");

    expect($stub.draggable).toHaveBeenCalledWith(
      { containment: "parent",
        handle: ".drag-handle",
        scroll: true,
        stack: $stub
      });
  });
});
