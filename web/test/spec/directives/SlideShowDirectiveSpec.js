describe("SlideShowDirective", function() {
  var linkFunction, scope, $stub, eventListener, watcherFn;

  beforeEach(function() {
    $stub = testHelper.stubJQuery("test-element");
    $stub.cycle = jasmine.createSpy("$.cycle()");
    scope = {
      $on: jasmine.createSpy("scope.$on()").andCallFake(function(event, listener) {
        eventListener = listener;
      }),
      $eval: sinon.stub().withArgs("test_expr").returns({start: 'test_event'}),
      $watch: jasmine.createSpy("scope.$watch").andCallFake(function(expr, callback) {
        watcherFn = callback;
      })
    }
    linkFunction = jashboard.angular.slideShowDirective();

    linkFunction(scope, "test-element", {jbSlideShow: "test_expr", jbSlideShowItems: "test_expr_items"});
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
  it("should watch the slide show items", function() {
    expect(scope.$watch).toHaveBeenCalledWith("test_expr_items", jasmine.any(Function));
  });
  it("should stop the slide show if the items change", function() {
    angular.equals = sinon.stub().withArgs("new_items", "old_items").returns(false);
    
    watcherFn("new_items", "old_items");

    expect($stub.cycle).toHaveBeenCalledWith("destroy");
  });
  it("should not stop the slide show if the items are equal", function() {
    angular.equals = sinon.stub().withArgs("new_items", "old_items").returns(true);
    
    watcherFn("new_items", "old_items");

    expect($stub.cycle).not.toHaveBeenCalled();
  });
  it("should not stop the slide show if the items are undefined", function() {
    watcherFn(undefined, "old_items");

    expect($stub.cycle).not.toHaveBeenCalled();
  });
});
