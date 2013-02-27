describe("WidgetService", function() {
  var service;
  var $stub;

  beforeEach(function() {
    $stub = testHelper.stubJQuery(["test-selector"]);
    service = new jashboard.WidgetService();
  });

  describe("Drag function", function() {
    beforeEach(function() {
      $stub.draggable = jasmine.createSpy("$.draggable()");
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

  describe("Resize function", function() {
    beforeEach(function() {
      $stub.resizable = jasmine.createSpy("$.resizable()");
    });
    it("should invoke $.resizable() with default options", function() {
      service.makeResizable("test-selector");

      expect($stub.resizable).toHaveBeenCalledWith(
        { 
          containment: "parent",
          autoHide: true
        });
    });
    it("should invoke $.resizable() with additional options", function() {
      service.makeResizable("test-selector", {option1: "test1", option2: "test2"});

      expect($stub.resizable).toHaveBeenCalledWith(
        { containment: "parent",
          autoHide: true,
          option1: "test1",
          option2: "test2"
        });
    });
  });

  describe("resizeFromParent", function() {
    var $childElement, $parentElement;
    beforeEach(function() {
      var child = {id: "child"}, parent = {id: "parent"};
      $parentElement = jasmine.createSpyObj("$(parent)", ['height']);
      $childElement = jasmine.createSpyObj("$(child)", ['position', 'height']);
      $stub = testHelper.stubJQuery();
      $stub.withArgs("parent-selector").returns(parent);
      $stub.withArgs(parent).returns($parentElement);
      $stub.withArgs("children-selector", parent).returns($stub);
      $stub.withArgs(child).returns($childElement);
      $stub.each = jasmine.createSpy("$.each()").andCallFake(function(callback) {
        callback(null, child);
      });

      $parentElement.height = jasmine.createSpy("$.height").andReturn("150");
      $childElement.position = jasmine.createSpy("$.position()").andReturn({top: 100, left: 200});
    });

    it("should recalculate the height of the children elements", function() {
      service.resizeFromParent("children-selector", "parent-selector");

      expect($childElement.height).toHaveBeenCalledWith(50);
    });
  });
});
