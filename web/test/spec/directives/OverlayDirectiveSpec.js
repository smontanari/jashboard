describe("OverlayDirective", function() {
  var overlayService, scope, actions;

  beforeEach(function() {
    scope = {
      $eval: sinon.stub()
    };
    scope.$eval.withArgs("test-map").returns("test-events");
    spyOn(jashboard.angularUtils, 'mapEventActions').and.callFake(function(scope, eventsMap, actionsMap) {
      actions = actionsMap;
    });

    overlayService = jasmine.createSpyObj("OverlayService", ["show", "hide"]);
    var linkFunction = jashboard.angular.overlayDirective(overlayService);

    linkFunction(scope, "test-element", {jbOverlay: "test-map", jbOverlayOptions: "test_options_map"});
  });

  it("should map the events to the actions", function() {
    expect(jashboard.angularUtils.mapEventActions).toHaveBeenCalledWith(scope, "test-events", jasmine.any(Object));
  });

  it("The 'show' action should invoke the overlayService", function() {
    actions.show();
    expect(overlayService.show).toHaveBeenCalledWith("test-element", undefined);
  });
  it("The 'hide' action should invoke the overlayService", function() {
    actions.hide();
    expect(overlayService.hide).toHaveBeenCalled();
  });
  it("should set the opacity level given in the options attribute", function() {
    scope.$eval.withArgs("test_options_map").returns({opacity: 123});
    actions.show();

    expect(overlayService.show).toHaveBeenCalledWith(jasmine.any(String), {opacity: 123});
  });
  it("should set the autoHideAfter property given in the options attribute", function() {
    scope.$eval.withArgs("test_options_map").returns({autoHideAfter: 123});
    actions.show();

    expect(overlayService.show).toHaveBeenCalledWith(jasmine.any(String), {autoHideAfter: 123});
  });
});
