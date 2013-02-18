describe("WidgetService", function() {
  var service;
  var $stub;

  beforeEach(function() {
    $stub = testHelper.stubJQuery(["test-selector"]);
    $stub.draggable = jasmine.createSpy("$.draggable()");
    service = new jashboard.WidgetService();
  });

  it("should invoke $.draggable() with default options", function() {
    service.makeDraggable("test-selector");

    expect($stub.draggable).toHaveBeenCalledWith(
      { containment: "parent",
        scroll: true,
        stack: $stub
      });
  });

  it("should invoke $.draggable() with additional options", function() {
    service.makeDraggable("test-selector", {option1: "test1", option2: "test2"});

    expect($stub.draggable).toHaveBeenCalledWith(
      { containment: "parent",
        scroll: true,
        stack: $stub,
        option1: "test1",
        option2: "test2"
      });
  });
});
