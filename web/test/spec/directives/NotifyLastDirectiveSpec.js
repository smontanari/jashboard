describe("NotifyLastDirective", function() {
  var linkFunction, scope;

  beforeEach(function() {
    scope = {
      $emit: jasmine.createSpy("scope.$emit()")
    };

    linkFunction = jashboard.angular.notifyLastDirective();
  });

  it("should emit the event on the last element of the iteration", function() {
    scope.$last = true;

    linkFunction(scope, "test-element", {"jbNotifyLast": "test_event"})

    expect(scope.$emit).toHaveBeenCalledWith("test_event");
  });
  it("should not emit the event on other elements of the iteration", function() {
    scope.$last = false;

    linkFunction(scope, "test-element", {"jbNotifyLast": "test_event"})

    expect(scope.$emit).not.toHaveBeenCalled();
  });
});
