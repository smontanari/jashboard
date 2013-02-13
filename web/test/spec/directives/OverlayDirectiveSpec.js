describe("OverlayDirective", function() {
  var linkFunction, overlayService, scope, attrs;

  beforeEach(function() {
    overlayService = jasmine.createSpyObj("OverlayService", ["show", "hide"]);
    linkFunction = jashboard.overlayDirective(overlayService);
    scope = {
      $eval: jasmine.createSpy("scope.$eval()").andReturn({show: "testEventShow", hide: "testEventHide"}),
      $on: jasmine.createSpy("scope.$on()").andCallFake(function(eventName, callback) {
        callback({});
      })
    };
    attrs = {'jbOverlay': "test-map"};

    linkFunction(scope, "test.element", attrs);
  });

  it("should evaluate the attribute", function() {
    expect(scope.$eval).toHaveBeenCalledWith('test-map');
  });

  describe("Show action", function() {
    it("should register the event listener", function() {
      expect(scope.$on).toHaveBeenCalledWith("testEventShow", jasmine.any(Function));
    });
    it("should invoke the overlayService", function() {
      expect(overlayService.show).toHaveBeenCalledWith("test.element");
    });
  });

  describe("Hide action", function() {
    it("should register the event listener", function() {
      expect(scope.$on).toHaveBeenCalledWith("testEventHide", jasmine.any(Function));
    });
    it("should invoke the overlayService", function() {
      expect(overlayService.hide).toHaveBeenCalledWith("test.element");
    });
  });
});
