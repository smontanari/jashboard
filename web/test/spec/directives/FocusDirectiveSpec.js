describe("FocusDirective", function() {
  var widgetService, scope, linkFunction, eventListener;

  beforeEach(function() {
    widgetService = jasmine.createSpyObj("WidgetService", ["setFocus"]);
    scope = {
      $eval: sinon.stub(),
      $on: jasmine.createSpy("scope.$on()").andCallFake(function(eventName, callback) {
        if (eventName === "test-event") eventListener = callback;
      })
    };
    scope.$eval.withArgs("test-map").returns({triggerOnEvent: "test-event"});

    linkFunction = jashboard.angular.focusDirective(widgetService);
    linkFunction(scope, "test-element", {jbFocus: "test-map"});
  });

  it("should invoke the widget service to set the element on focus", function() {
    eventListener({});

    expect(widgetService.setFocus).toHaveBeenCalledWith("test-element");
  });
});
