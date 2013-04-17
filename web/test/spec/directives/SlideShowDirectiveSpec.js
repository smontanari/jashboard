describe("SlideShowDirective", function() {
  var linkFunction, scope, $stub, eventListener;

  beforeEach(function() {
    $stub = testHelper.stubJQuery("test-element");
    $stub.cycle = jasmine.createSpy("$.cycle()");
    scope = {
      $on: jasmine.createSpy("scope.$on()").andCallFake(function(event, listener) {
        eventListener = listener;
      }),
      $eval: sinon.stub().withArgs("test_expr").returns({start: 'test_event'})
    }
    linkFunction = jashboard.angular.slideShowDirective();

    linkFunction(scope, "test-element", {jbSlideShow: "test_expr"});
  });

  it("should listen to the event", function() {
    expect(scope.$on).toHaveBeenCalledWith("test_event", jasmine.any(Function));
  });
  it("should trigger the slide show when receiving the event", function() {
    var event = jasmine.createSpyObj("event", ['stopPropagation']);
    
    eventListener(event);
    
    expect($stub.cycle).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  });
  it("should not trigger the slide show when not receiving the event", function() {
    expect($stub.cycle).not.toHaveBeenCalled();
  });
});
