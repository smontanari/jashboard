describe("WidgetService", function() {
  var service;
  var $stub;

  beforeEach(function() {
    $stub = testHelper.stubJQuery("test-selector");
    service = new jashboard.WidgetService();
  });

  describe("makeDraggable()", function() {
    beforeEach(function() {
      $stub.draggable = jasmine.createSpy("$.draggable()");
    });
    it("should invoke $.draggable() with default options", function() {
      service.makeDraggable("test-selector");

      expect($stub.draggable).toHaveBeenCalledWith(
        { containment: "parent",
          scroll: true
        });
    });
    it("should invoke $.draggable() with additional options", function() {
      service.makeDraggable("test-selector", {option1: "test1", option2: "test2"});

      expect($stub.draggable).toHaveBeenCalledWith(
        { containment: "parent",
          scroll: true,
          option1: "test1",
          option2: "test2"
        });
    });
  });

  describe("makeResizable()", function() {
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

  describe("resetContainerHeight()", function() {
    var $element;
    beforeEach(function() {
      $element = testHelper.stubJQuery("test-selector");
      $element.height = jasmine.createSpy("$.height()").andReturn(100);
      $element.outerHeight = jasmine.createSpy("$.outerHeight()").andReturn(120);
      $element.position = jasmine.createSpy("$.position()").andReturn({top: 30});
    });

    it("should recalculate the height of the element", function() {
      service.resetContainerHeight("test-selector");

      expect($element.height).toHaveBeenCalledWith(60);
    });
  });

  describe("setFocus()", function() {
    var $element;
    beforeEach(function() {
      $element = testHelper.stubJQuery("test-selector");
      $element.focus = jasmine.createSpy("$.focus()");
    });

    it("should trigger the focus event on the element", function() {
      service.setFocus("test-selector");

      expect($element.focus).toHaveBeenCalled();
    });
  });
});
