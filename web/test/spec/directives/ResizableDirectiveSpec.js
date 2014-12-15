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

  it("should emit the given event when the resize action stops", function() {
    widgetService.makeResizable = jasmine.createSpy("widgetService.makeResizable()")
      .and.callFake(function(selector, options) {
        options.stop({}, {element: mockElement});
      });
    scope.$eval = jasmine.createSpy("scope.$eval()").and.returnValue({onResizeStop: "TestEvent"});

    linkFunction(scope, "test-element", {"jbResizable": "test-map"});

    expect(scope.$eval).toHaveBeenCalledWith("test-map");
    expect(widgetService.makeResizable).toHaveBeenCalledWith("test-element", {stop: jasmine.any(Function)});
    expect(scope.$emit).toHaveBeenCalledWith("TestEvent", {width: 123, height: 456});
  });
  it("should pass the alsoResize option with the selected children element to the service", function() {
    angular.element = sinon.stub().withArgs("test-element").returns({
      children: sinon.stub().withArgs("test-selector").returns("test-child")
    });
    scope.$eval = jasmine.createSpy("scope.$eval()").and.returnValue({resizeChildren: "test-selector"});

    linkFunction(scope, "test-element", {"jbResizable": "test-map"});
    expect(scope.$eval).toHaveBeenCalledWith("test-map");
    expect(widgetService.makeResizable).toHaveBeenCalledWith("test-element", {alsoResize: "test-child"});
  });
});