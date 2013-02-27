describe("ResizeFromParentDirective", function() {
  var widgetService, linkFunction, scope;
  
  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ['$eval', '$on']);
    widgetService = jasmine.createSpyObj("WidgetService", ["resizeFromParent"]);
  });

  it("should handle the given resize event", function() {
    scope.$eval = jasmine.createSpy("scope.$eval()").andReturn({on: "TestEvent"});
    linkFunction = jashboard.angular.resizeFromParentDirective(widgetService);

    expect(scope.$on).toHaveBeenCalledWith("TestEvent");
  });
  xit("should resize the element based on the parent", function() {
    widgetService.resizeFromParent = jasmine.createSpy("widgetService.resizeFromParent()")
      .andCallFake(function(selector, options) {
        options.resize({target: "targetElement"}, {size: {width: 123, height: 456}});
      });
    scope.$eval = jasmine.createSpy("scope.$eval()").andReturn({resizeChildren: "children_element_selector"});

    linkFunction(scope, "test-element", {"jbResizable": "test-map"});

    expect(scope.$eval).toHaveBeenCalledWith("test-map");
    expect(widgetService.resizeFromParent).toHaveBeenCalledWith("test-element", 
      {handle: "test-handle-selector"});
  });
});