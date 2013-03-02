describe("MonitorControllerDelegate", function() {
  var delegate, scope, repository, testMonitor, successHandler, errorHandler;

  beforeEach(function() {
    successHandler = jasmine.createSpy("successHandler");
    errorHandler = jasmine.createSpy("errorHandler");
    testMonitor = 
    {
      id: "test_id",
      name: "test.monitor",
      type: "test_type"
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
        expect(testMonitor.position).toEqual({top: 10, left: 20});
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
      it("should syncronise the scope", function() {
        expect(scope.$apply).toHaveBeenCalled();
      });
    });
  });

  describe("scope.refreshRuntimeInfo()", function() {
    var runtimeSynchHandlers, innerScope = jasmine.createSpyObj("innerScope", ['$apply']);
    beforeEach(function() {
      repository.loadMonitorRuntimeInfo = jasmine.createSpy("repository.loadMonitorRuntimeInfo()")
          .andCallFake(function(monitor_id, monitor_type, handlers) {
            runtimeSynchHandlers = handlers;
          });

      delegate.init(scope);
      innerScope.monitor = testMonitor;
      testMonitor.runtimeInfo = "test_initial_runtime";
      scope.refreshRuntimeInfo.apply(innerScope);
    });
    it("should invoke the repository", function() {
      expect(repository.loadMonitorRuntimeInfo).toHaveBeenCalledWith("test_id", "test_type", jasmine.any(Object));
    });
    it("should set the monitor loadingStatus to 'waiting'", function() {
      expect(testMonitor.loadingStatus).toEqual(jashboard.model.loadingStatus.waiting);
    });

    describe("on success", function() {
      beforeEach(function () {
        runtimeSynchHandlers.success({testRuntimeInfo: "test"});
      });
      it("should update the runtime data", function() {
        expect(testMonitor.runtimeInfo).toEqual({testRuntimeInfo: "test"});
      });
      it("change the loading status to 'completed'", function() {
        expect(testMonitor.loadingStatus).toEqual(jashboard.model.loadingStatus.completed);
      });
      it("should apply the changes to the scope", function() {
        expect(innerScope.errorMessage).toBeUndefined();
        expect(innerScope.$apply).toHaveBeenCalled();
      });
    });

    describe("on failure", function() {
      beforeEach(function () {
        runtimeSynchHandlers.error("test_status", "test_message", "test_error");
      });
      it("should not change the runtime data", function() {
        expect(testMonitor.runtimeInfo).toEqual("test_initial_runtime");
      });
      it("should change the loading status to 'error'", function() {
        expect(testMonitor.loadingStatus).toEqual(jashboard.model.loadingStatus.error);
      });
      it("should apply the changes to the scope", function() {
        expect(innerScope.errorMessage).toEqual("Error refreshing runtime information - test_message [test_error]");
        expect(innerScope.$apply).toHaveBeenCalled();
      });
    });
  });
});