describe("ResizableDirective", function() {
  var widgetService, linkFunction, scope, mockElement;
  
  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ['$eval', '$emit', '$broadcast']);
    widgetService = jasmine.createSpyObj("WidgetService", ["makeResizable"]);
    mockElement = {
      width: function() { return 123; },
      height: function() { return 456; }
    };
    
    linkFunction = jashboard.angular.resizableDirective(widgetService);
  });

  it("should broadcast the given event during the resizing process", function() {
    widgetService.makeResizable = jasmine.createSpy("widgetService.makeResizable()")
      .andCallFake(function(selector, options) {
        options.resize({target: "targetElement"}, {element: mockElement});
      });
    scope.$eval = jasmine.createSpy("scope.$eval()").andReturn({onResize: "TestEvent"});

    linkFunction(scope, "test-element", {"jbResizable": "test-map"});

    expect(scope.$eval).toHaveBeenCalledWith("test-map");
    expect(widgetService.makeResizable).toHaveBeenCalledWith("test-element", {resize: jasmine.any(Function)});
    expect(scope.$broadcast).toHaveBeenCalledWith("TestEvent", "targetElement");
  });    
  it("should emit the given event when the resize action stops", function() {
    widgetService.makeResizable = jasmine.createSpy("widgetService.makeResizable()")
      .andCallFake(function(selector, options) {
        options.stop({}, {element: mockElement});
      });
    scope.$eval = jasmine.createSpy("scope.$eval()").andReturn({onResizeStop: "TestEvent"});

    linkFunction(scope, "test-element", {"jbResizable": "test-map"});

    expect(scope.$eval).toHaveBeenCalledWith("test-map");
    expect(widgetService.makeResizable).toHaveBeenCalledWith("test-element", {stop: jasmine.any(Function)});
    expect(scope.$emit).toHaveBeenCalledWith("TestEvent", {width: 123, height: 456});
  });
});