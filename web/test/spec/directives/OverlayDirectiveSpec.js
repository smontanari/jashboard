describe("OverlayDirective", function() {
  var overlayService, actions;

  beforeEach(function() {
    overlayService = jasmine.createSpyObj("OverlayService", ["show", "hide"]);
    spyOn(jashboard.angular, "EventDirectiveDefinition")
      .andCallFake(function(attributeName, factory) {
        actions = factory("test-element");
      });

    jashboard.angular.overlayDirective(overlayService);
  });

  it("should pass the correct attribute name", function() {
    expect(jashboard.angular.EventDirectiveDefinition).toHaveBeenCalledWith("jbOverlay", jasmine.any(Function));
  });
  it("The 'show' action should invoke the overlayService", function() {
    actions.show();
    expect(overlayService.show).toHaveBeenCalledWith("test-element");
  });
  it("The 'hide' action should invoke the overlayService", function() {
    actions.hide();
    expect(overlayService.hide).toHaveBeenCalledWith("test-element");
  });
});
