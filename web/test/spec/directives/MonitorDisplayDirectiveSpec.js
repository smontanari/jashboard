describe("MonitorDisplayDirective", function() {
  var widgetService, scope, linkFunction, $stub;

  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ['$on']);
    $stub = testHelper.stubJQuery("test-element");
    widgetService = jasmine.createSpyObj("widgetService", ['resetContainerHeight'])
    linkFunction = jashboard.angular.monitorDisplayDirective(widgetService);
    
    linkFunction(scope, "test-element", {});
  });

  it("should not recalculate the size if the monitor has no fixed size", function() {
    scope.monitor = {};
    scope.resetSize();

    expect(widgetService.resetContainerHeight).not.toHaveBeenCalled();
  });
  it("should recalculate the size if the element is visible", function() {
    scope.monitor = {size: {}};
    $stub.is = sinon.stub().withArgs(":visible").returns(true);
    scope.resetSize();

    expect(widgetService.resetContainerHeight).toHaveBeenCalledWith("test-element");
  });
  describe("element not visible", function() {
    var eventHandler, cancelListener;
    beforeEach(function() {
      scope.monitor = {size: {}};
      cancelListener = jasmine.createSpy("cancelListener");
      $stub.is = sinon.stub().withArgs(":visible").returns(false);
      scope.$on = jasmine.createSpy("scope.$on()").andCallFake(function(eventName, listener) {
        eventHandler = listener;
        return cancelListener;
      })
      scope.resetSize();
    });
    it("should not recalculate the size", function() {
      expect(widgetService.resetContainerHeight).not.toHaveBeenCalled();
    });
    describe("'DashboardVisible' event handler", function() {
      beforeEach(function() {
        scope.dashboard = {id: "test_dashboard_id"};
      });

      it("should listen to the 'DashboardVisible' event", function() {
        expect(scope.$on).toHaveBeenCalledWith("DashboardVisible", jasmine.any(Function));
      });
      it("should not recalculate the size if not same dashboard", function() {
        eventHandler({}, "another_dashboard_id");
        
        expect(widgetService.resetContainerHeight).not.toHaveBeenCalled();
        expect(cancelListener).not.toHaveBeenCalled();
      });
      it("should deregister the listener once executed", function() {
        eventHandler({}, "test_dashboard_id");
        
        expect(cancelListener).toHaveBeenCalled();
      });
      it("should recalculate the size of the element at a later point in time", function() {
        var called = false;
        widgetService.resetContainerHeight.andCallFake(function(element) {
          called = true;
        });
        runs(function() {
          eventHandler({}, "test_dashboard_id");
        });

        waitsFor(function() {
          return called;
        }, "call to widgetService", 200);

        runs(function() {
          expect(widgetService.resetContainerHeight).toHaveBeenCalledWith("test-element");
        });      
      });
    });
  });
});
