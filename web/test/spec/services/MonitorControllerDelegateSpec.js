describe("MonitorControllerDelegate", function() {
  var delegate, scope, repository, testMonitor, successHandler, errorHandler;

  beforeEach(function() {
    successHandler = jasmine.createSpy("successHandler");
    errorHandler = jasmine.createSpy("errorHandler");
    testMonitor = 
    {
      id: "test_id",
      name: "test.monitor",
      type: "test_type",
      setPosition: jasmine.createSpy("monitor.setPosition()"),
      runtimeInfoSynchroniser: function(callback) {
       callback();
       return {
        success: successHandler,
        error: errorHandler
       };
      }
    };
    scope = jasmine.createSpyObj("scope", ['$apply', '$on']);
    repository = {
      loadMonitorRuntimeInfo: jasmine.createSpy("repository.loadMonitorRuntimeInfo()")
        .andCallFake(function(monitor_id, monitor_type, handlers) {
          handlers.success("testRuntimeInfo");
        }),
        updateMonitorPosition: jasmine.createSpy("repository.updateMonitorPosition()")
    };
    delegate = new jashboard.MonitorControllerDelegate(repository);
  });

  describe("init()", function() {
    describe("'MonitorPositionChanged' event handler", function() {
      var eventObject;
      beforeEach(function() {
        eventObject = {
          targetScope: {
            monitor: testMonitor
          },
          stopPropagation: jasmine.createSpy("event.stopPropagation()")
        };
        scope.dashboards = [
          {id: "dashboard1", monitors: [{id: "m1"}, testMonitor]},
          {id: "dashboard2", monitors: [{id: "m3"}]}
        ];
        scope.$on = jasmine.createSpy("scope.$on()").andCallFake(function(eventName, callback) {
          if (eventName === "MonitorPositionChanged") {
            callback(eventObject, {}, {top: 10, left: 20});
          }
        });

        delegate.init(scope);
      });
      it("should update the monitor position", function() {
        expect(testMonitor.setPosition).toHaveBeenCalledWith({top: 10, left: 20});
      });
      it("should invoke the repository", function() {
        expect(repository.updateMonitorPosition).toHaveBeenCalledWith("test_id", {top: 10, left: 20});
      });
      it("should stop the event propagation", function() {
        expect(eventObject.stopPropagation).toHaveBeenCalled();
      });
    });

    describe("'NewMonitorCreated' event handler", function() {
      beforeEach(function() {
        eventObject = {
          targetScope: {
            monitorForm: {
              dashboard_id: "dashboard2"
            }
          },
          stopPropagation: jasmine.createSpy("event.stopPropagation()")
        };
        scope.$on = jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
          if (eventName === "NewMonitorCreated") {
            handler(eventObject, testMonitor);
          }
        });
        scope.dashboards = [
          {id: "dashboard1", monitors: [{id: "m1"}]},
          {id: "dashboard2", monitors: [{id: "m2"}]}
        ];

        delegate.init(scope);
      });

      it("should add the monitor to the dashboard", function() {
        expect(scope.dashboards[0].monitors.length).toEqual(1);
        expect(scope.dashboards[1].monitors.length).toEqual(2);
        expect(scope.dashboards[1].monitors).toContain(testMonitor);
      });
      it("should invoke the repository with monitor parameters", function() {
        expect(repository.loadMonitorRuntimeInfo).toHaveBeenCalledWith("test_id", "test_type", jasmine.any(Object));
      });
      it("should use the monitor runtimeInfoSynchroniser.success as a callback", function() {
        expect(successHandler).toHaveBeenCalledWith("testRuntimeInfo");
      });
      it("should syncronise the scope", function() {
        expect(scope.$apply).toHaveBeenCalled();
      });
    });
  });

  describe("updateRuntimeInfo", function() {
    beforeEach(function() {
      delegate.updateMonitorRuntime(scope, testMonitor);
    });

    it("should invoke the repository with monitor parameters", function() {
      expect(repository.loadMonitorRuntimeInfo).toHaveBeenCalledWith("test_id", "test_type", jasmine.any(Object));
    });
    it("should use the monitor runtimeInfoSynchroniser.error as a callback", function() {
      expect(successHandler).toHaveBeenCalledWith("testRuntimeInfo");
    });
    it("should syncronise the scope", function() {
      expect(scope.$apply).toHaveBeenCalled();
    });
  });
});