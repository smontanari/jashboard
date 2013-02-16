describe("WidgetService", function() {
  var service;
  var $stub;

  beforeEach(function() {
    $stub = testHelper.stubJQuery(["test-selector"]);
    $stub.draggable = jasmine.createSpy("$.draggable()");
    service = new jashboard.WidgetService();
  });

  it("should invoke $.draggable()", function() {
    service.makeDraggable("test-selector", "test-handle-selector");

    expect($stub.draggable).toHaveBeenCalledWith(
      { containment: "parent",
        handle: "test-handle-selector",
        scroll: true,
        stack: $stub
      });
  });
});
