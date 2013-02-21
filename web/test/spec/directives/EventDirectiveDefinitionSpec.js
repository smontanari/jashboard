describe("EventDirectiveDefinition", function() {
  var scope, actionCallback1, actionCallback2, eventDirectiveDefinition;

  beforeEach(function() {
    actionCallback1 = jasmine.createSpy("actionCallback1()");
    actionCallback2 = jasmine.createSpy("actionCallback2()");
    var callbacksDefinition = function(element) {
      return {
        testAction1: function() {
          actionCallback1(element);
        },
        testAction2: function() {
          actionCallback2(element);
        }
      };
    }

    scope = {
      $eval: sinon.stub(),
      $on: jasmine.createSpy("scope.$on()").andCallFake(function(eventName, callback) {
        callback({});
      })
    };
    scope.$eval.withArgs("test-map").returns({testAction1: "testEvent1", testAction2: "testEvent2,testEvent3"});

    eventDirectiveDefinition = new jashboard.angular.EventDirectiveDefinition("testAttribute", callbacksDefinition);

    eventDirectiveDefinition.link(scope, "test.element", {'testAttribute': "test-map"})
  });

  it("should register the events listeners", function() {
    expect(scope.$on).toHaveBeenCalledWith("testEvent1", jasmine.any(Function));
    expect(scope.$on).toHaveBeenCalledWith("testEvent2", jasmine.any(Function));
    expect(scope.$on).toHaveBeenCalledWith("testEvent3", jasmine.any(Function));
  });
  it("should invoke the actions", function() {
    expect(actionCallback1).toHaveBeenCalledWith("test.element");
    expect(actionCallback2).toHaveBeenCalledWith("test.element");
    expect(actionCallback2.calls.length).toEqual(2);
  });
});