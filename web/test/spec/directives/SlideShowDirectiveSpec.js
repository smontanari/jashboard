describe("SlideShowDirective", function() {
  var linkFunction, scope, $stub, eventListener, event;

  var triggerStartSlideShowAndRunTest = function(testFn) {
    var called = false;
    $stub.cycle.andCallFake(function() {
      called = true;
    });

    runs(function() {
      eventListener(event);
    });

    waitsFor(function() {
      return called;
    }, "call to $.cycle()", 200);

    runs(testFn);
  };

  beforeEach(function() {
    event = jasmine.createSpyObj("event", ['stopPropagation']);
    $stub = testHelper.stubJQuery("test-element");
    $stub.cycle = jasmine.createSpy("$.cycle()");
    scope = {
      $on: jasmine.createSpy("scope.$on()").andCallFake(function(event, listener) {
        eventListener = listener;
      }),
      $eval: sinon.stub().withArgs("test_expr").returns({start: 'test_event'})
    }
    linkFunction = jashboard.angular.slideShowDirective();

    linkFunction(scope, "test-element", {jbSlideShow: "test_expr", jbSlideShowItems: "test_expr_items"});
  });

  it("should listen to the event", function() {
    expect(scope.$on).toHaveBeenCalledWith("test_event", jasmine.any(Function));
  });
  it("should defer the start of the slide show when receiving the start event", function() {
    triggerStartSlideShowAndRunTest(function() {
      expect($stub.cycle).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });
  it("should stop the slide show before restarting it if it was already started", function() {
    triggerStartSlideShowAndRunTest(function() {
      eventListener(event);
      expect($stub.cycle).toHaveBeenCalledWith("destroy");
    });
  });
});
