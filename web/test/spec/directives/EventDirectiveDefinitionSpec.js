describe("EventDirectiveDefinition", function() {
  var scope, actionCallback, eventDirectiveDefinition;

  beforeEach(function() {
    actionCallback = jasmine.createSpy("actionCallback()");
    var callbacksDefinition = function(element) {
      return {
        testAction1: function() {
          actionCallback(element);
        },
        testAction2: function() {
          actionCallback(element);
        }
      };
    }

    scope = {
      $eval: sinon.stub(),
      $on: jasmine.createSpy("scope.$on()").andCallFake(function(eventName, callback) {
        callback({});
      })
    };
    scope.$eval.withArgs("test-map").returns({testAction1: "testEvent1", testAction2: "testEvent2"});

    eventDirectiveDefinition = new jashboard.angular.EventDirectiveDefinition("testAttribute", callbacksDefinition);

    eventDirectiveDefinition.link(scope, "test.element", {'testAttribute': "test-map"})
  });

  it("should register the events listeners", function() {
    expect(scope.$on).toHaveBeenCalledWith("testEvent1", jasmine.any(Function));
    expect(scope.$on).toHaveBeenCalledWith("testEvent2", jasmine.any(Function));
  });
  it("should invoke the actions", function() {
    expect(actionCallback).toHaveBeenCalledWith("test.element");
    expect(actionCallback).toHaveBeenCalledWith("test.element");
  });
});