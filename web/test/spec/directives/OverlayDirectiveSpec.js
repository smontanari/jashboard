describe("OverlayDirective", function() {
  var overlayService, scope;

  beforeEach(function() {
    scope = {
      $eval: sinon.stub()
    };
    overlayService = jasmine.createSpyObj("OverlayService", ["show", "hide"]);
  });

  describe("Handling events", function() {
    var actions;
    beforeEach(function() {
      spyOn(jashboard.angular, "EventDirectiveDefinition")
        .andCallFake(function(attributeName, factory) {
          actions = factory(scope, "test-element", {});
        });

      jashboard.angular.overlayDirective(overlayService);
    });

    it("should create an EventDirectiveDefinition", function() {
      expect(jashboard.angular.EventDirectiveDefinition).toHaveBeenCalledWith("jbOverlay", jasmine.any(Function));
    });
    it("The 'show' action should invoke the overlayService", function() {
      actions.show();
      expect(overlayService.show).toHaveBeenCalledWith("test-element", undefined);
    });
    it("The 'hide' action should invoke the overlayService", function() {
      actions.hide();
      expect(overlayService.hide).toHaveBeenCalled();
    });
  });

  describe("Handling jbOverlayOptions", function() {
    beforeEach(function() {
      spyOn(jashboard.angular, "EventDirectiveDefinition")
        .andCallFake(function(attributeName, factory) {
          actions = factory(scope, "", {jbOverlayOptions: "test_options_map"});
        });

      jashboard.angular.overlayDirective(overlayService);      
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
});
