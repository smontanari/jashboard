describe("DraggableDirective", function() {
  var widgetService, linkFunction;

  it("should invoke the widgetService", function() {
    widgetService = jasmine.createSpyObj("WidgetService", ["makeDraggable"]);
    
    linkFunction = jashboard.angular.draggableDirective(widgetService);

    linkFunction({}, "test-element");
    expect(widgetService.makeDraggable).toHaveBeenCalledWith("test-element");
  });
});