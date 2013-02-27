describe("DraggableDirective", function() {
  var widgetService, linkFunction, scope;
  
  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ['$eval', '$emit']);
    widgetService = jasmine.createSpyObj("WidgetService", ["makeDraggable"]);
    
    linkFunction = jashboard.angular.draggableDirective(widgetService);
  });

  it("should invoke the widgetService with the 'handle' option", function() {
    scope.$eval = jasmine.createSpy("scope.$eval()").andReturn({handleSelector: 'test-handle-selector'});

    linkFunction(scope, "test-element", {"jbDraggable": "test-map"});

    expect(scope.$eval).toHaveBeenCalledWith("test-map");
    expect(widgetService.makeDraggable).toHaveBeenCalledWith("test-element", 
      {handle: "test-handle-selector"});
  });

  it("should invoke the widgetService with the 'stop' callback emitting the given event", function() {
    widgetService.makeDraggable = jasmine.createSpy("widgetService.makeDraggable()")
      .andCallFake(function(selector, options) {
        options.stop({target: "targetElement"}, {position: {top: 123, left: 456}});
      });
    scope.$eval = jasmine.createSpy("scope.$eval()").andReturn({onDragStop: "TestEvent"});

    linkFunction(scope, "test-element", {"jbDraggable": "test-map"});

    expect(scope.$eval).toHaveBeenCalledWith("test-map");
    expect(widgetService.makeDraggable).toHaveBeenCalledWith("test-element", {stop: jasmine.any(Function)});
    expect(scope.$emit).toHaveBeenCalledWith("TestEvent", "targetElement", {top: 123, left: 456});
  });
});