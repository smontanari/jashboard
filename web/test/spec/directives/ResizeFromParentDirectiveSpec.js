describe("ResizeFromParentDirective", function() {
  var widgetService, linkFunction, scope;
  
  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ['$on']);
    widgetService = jasmine.createSpyObj("WidgetService", ["resizeFromParent"]);
    linkFunction = jashboard.angular.resizeFromParentDirective(widgetService);
  });

  it("should handle the given parent resize event", function() {
    linkFunction(scope, {}, {"jbResizeFromParent": "TestEvent"});

    expect(scope.$on).toHaveBeenCalledWith("TestEvent", jasmine.any(Function));
  });
  it("should resize the element based on the parent", function() {
    widgetService.resizeFromParent = jasmine.createSpy("widgetService.resizeFromParent()");
    scope.$on = jasmine.createSpy("scope.$on()").andCallFake(function(eventName, listener) {
      listener({}, "parentElement");
    });

    linkFunction(scope, "test-element", {"jbResizeFromParent": "TestEvent"});

    expect(widgetService.resizeFromParent).toHaveBeenCalledWith("test-element", "parentElement");
  });
});