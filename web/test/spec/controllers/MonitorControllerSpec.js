describe("MonitorController", function() {
  var delegate, scope, repository, alertService, testMonitor;

  beforeEach(function() {
    testMonitor = 
    {
      id: "test_id",
      name: "test.monitor",
      type: "test_type"
    };
    scope = jasmine.createSpyObj("scope", ['$apply', '$on', '$emit']);
    scope.dashboards = [
      {id: "dashboard1", monitors: [{id: "m1"}, testMonitor]},
      {id: "dashboard2", monitors: [{id: "m3"}]}
    ];
    repository = jasmine.createSpyObj("repository", ['updateMonitorPosition', 'updateMonitorSize', 'loadMonitorRuntimeInfo']);
  });

  describe("'MonitorPositionChanged' and 'MonitorSizeChanged' events handler", function() {
    var positionChangedEventObject, sizeChangedEventObject;
    beforeEach(function() {
      positionChangedEventObject = {
        targetScope: {
          monitor: testMonitor
        },
        stopPropagation: jasmine.createSpy("event.stopPropagation()")
      };
      sizeChangedEventObject = {
        targetScope: {
          monitor: testMonitor
        },
        stopPropagation: jasmine.createSpy("event.stopPropagation()")
      };
      scope.$on = jasmine.createSpy("scope.$on()").andCallFake(function(eventName, callback) {
        if (eventName === "MonitorPositionChanged") {
          callback(positionChangedEventObject, {top: 10, left: 20});
        }
        if (eventName === "MonitorSizeChanged") {
          callback(sizeChangedEventObject, {width: 10, height: 20});
        }
      });

      new jashboard.MonitorController(scope, repository);
    });
    it("should update the monitor position", function() {
      expect(testMonitor.position).toEqual({top: 10, left: 20});
    });
    it("should update the monitor size", function() {
      expect(testMonitor.size).toEqual({width: 10, height: 20});
    });
    it("should invoke the repository to update the position", function() {
      expect(repository.updateMonitorPosition).toHaveBeenCalledWith("test_id", {top: 10, left: 20});
    });
    it("should invoke the repository to update the size", function() {
      expect(repository.updateMonitorSize).toHaveBeenCalledWith("test_id", {width: 10, height: 20});
    });
    it("should stop the event propagation", function() {
      expect(positionChangedEventObject.stopPropagation).toHaveBeenCalled();
    });
    it("should stop the event propagation", function() {
      expect(sizeChangedEventObject.stopPropagation).toHaveBeenCalled();
    });
  });

  describe("scope.removeMonitor()", function() {
    var deleteHandlers, alertOptions, timeoutService;
    beforeEach(function() {
      alertService = {
        showAlert: jasmine.createSpy("alertService.showAlert()").andCallFake(function(options) {
          alertOptions = options;
        })
      };
      repository = {
          deleteMonitor: jasmine.createSpy("repository.deleteMonitor()").andCallFake(function(dashboard_id, monitor_id, handlers) {
            deleteHandlers = handlers;
          })
      };
      timeoutService = jasmine.createSpyObj("$timeout", ['cancel']);
      scope.dashboard = {id: "test_dashboard", monitors: [{id: "m1"}, {id: "m2"}, testMonitor]};
      scope.monitor = testMonitor;

      new jashboard.MonitorController(scope, repository, alertService, timeoutService);
      scope.removeMonitor();
    });

    it("should invoke the alert service to display the alert box", function() {
      expect(alertOptions.title).toEqual("Remove monitor test.monitor");
      expect(alertOptions.message).toEqual("If you delete this monitor you will lose all its data. Continue?");
      expect(alertOptions.confirmLabel).toEqual("Delete");
    });
    it("should delete the monitor on confirmation", function() {
      alertOptions.confirmAction();

      expect(repository.deleteMonitor).toHaveBeenCalledWith("test_dashboard", "test_id", jasmine.any(Object));
    });
    it("should remove the monitor from the dashboard on successful deletion", function() {
      alertOptions.confirmAction();
      deleteHandlers.success();

      expect(scope.dashboard.monitors).toEqual([{id: "m1"}, {id: "m2"}]);
      expect(scope.$apply).toHaveBeenCalled();
    });
    it("should fire the 'MonitorDeleteStart' event on confirmation", function() {
      alertOptions.confirmAction();

      expect(scope.$emit).toHaveBeenCalledWith("MonitorDeleteStart");
    });
    it("should fire the 'MonitorDeleteComplete' event on successful deletion", function() {
      alertOptions.confirmAction();
      deleteHandlers.success();
      
      expect(scope.$emit).toHaveBeenCalledWith("MonitorDeleteComplete");
    });
    it("should cancel the monitor update scheduler on successful deletion", function() {
      scope.monitor.scheduler = {id: "scheduler"};
      alertOptions.confirmAction();
      deleteHandlers.success();
      
      expect(timeoutService.cancel).toHaveBeenCalledWith({id: "scheduler"});
    });
    it("should fire the 'AjaxError' event when failing to remove the monitor", function() {
      alertOptions.confirmAction();
      deleteHandlers.error();

      expect(scope.$emit).toHaveBeenCalledWith("AjaxError");
    });
  });

  describe("scope.loadRuntimeInfo()", function() {
    beforeEach(function() {
      scope.monitor = {
        id: "test_id",
        type: "test_type"          
      }
      new jashboard.MonitorController(scope, repository);
    });
    it ("should not start loading the data if the monitor loading status is completed", function() {
      scope.monitor.loadingStatus = jashboard.model.loadingStatus.completed;
      
      scope.loadRuntimeInfo();

      expect(repository.loadMonitorRuntimeInfo).not.toHaveBeenCalled();
    });
    it ("should not start the data load if the monitor loading status is waiting", function() {
      scope.monitor.loadingStatus = jashboard.model.loadingStatus.waiting;
      
      scope.loadRuntimeInfo();

      expect(repository.loadMonitorRuntimeInfo).not.toHaveBeenCalled();
    });
    it("should start the data load if the monitor loading status is undefined", function() {
      scope.loadRuntimeInfo();

      expect(repository.loadMonitorRuntimeInfo).toHaveBeenCalledWith("test_id", "test_type", jasmine.any(Object));
    });
  });
  describe("runtime data refresh scheduling", function() {
    var timeoutService, scheduleFunction, handlers, scheduler;
    beforeEach(function() {
      scope.monitor = {
        id: "test_id",
        type: "test_type",
        refreshInterval: 10
      }
      scheduler = {id: "scheduler"};
      timeoutService = jasmine.createSpy("$timeout");
      timeoutService.andCallFake(function(fn, delay, invokeApply) {
        scheduleFunction = fn;
        return scheduler;
      });

      repository.loadMonitorRuntimeInfo = jasmine.createSpy("repository.loadMonitorRuntimeInfo()")
        .andCallFake(function(id, type, callbacks) {
          handlers = callbacks;
        });

      new jashboard.MonitorController(scope, repository, alertService, timeoutService);
    });

    it("should save the scheduler into the monitor after a successful data load", function() {
      scope.loadRuntimeInfo();
      handlers.success();

      expect(scope.monitor.scheduler).toEqual(scheduler);
    });
    it("should save the scheduler into the monitor after a failed data load", function() {
      scope.loadRuntimeInfo();
      handlers.error();

      expect(scope.monitor.scheduler).toEqual(scheduler);
    });
    it("should schedule the data load after the given interval", function() {
      scope.loadRuntimeInfo();
      handlers.success();

      expect(timeoutService).toHaveBeenCalledWith(jasmine.any(Function), 10000);
    });
    it("should schedule the call to the repository to load the data", function() {
      scope.loadRuntimeInfo();
      handlers.success();

      scheduleFunction();

      expect(repository.loadMonitorRuntimeInfo).toHaveBeenCalledWith("test_id", "test_type", jasmine.any(Object));
      expect(timeoutService.calls.length).toEqual(2);
    });
  });

  describe("scope.refreshRuntimeInfo()", function() {
    var handlers;
    beforeEach(function() {
      repository.loadMonitorRuntimeInfo = jasmine.createSpy("repository.loadMonitorRuntimeInfo()")
          .andCallFake(function(monitor_id, monitor_type, callbacks) {
            handlers = callbacks;
          });

      new jashboard.MonitorController(scope, repository);
      scope.monitor = testMonitor;
      testMonitor.runtimeInfo = "test_initial_runtime";

      scope.refreshRuntimeInfo();
    });
    it("should invoke the repository", function() {
      expect(repository.loadMonitorRuntimeInfo).toHaveBeenCalledWith("test_id", "test_type", jasmine.any(Object));
    });
    it("should set the loadingStatus to 'waiting'", function() {
      expect(scope.monitor.loadingStatus).toEqual(jashboard.model.loadingStatus.waiting);
    });

    describe("on success", function() {
      beforeEach(function () {
        handlers.success({testRuntimeInfo: "test"});
      });
      it("should update the runtime data", function() {
        expect(testMonitor.runtimeInfo).toEqual({testRuntimeInfo: "test"});
      });
      it("change the loading status to 'completed'", function() {
        expect(scope.monitor.loadingStatus).toEqual(jashboard.model.loadingStatus.completed);
      });
    });

    describe("on failure", function() {
      beforeEach(function () {
        handlers.error("test_status", "test_message", "test_error");
      });
      it("should not change the runtime data", function() {
        expect(testMonitor.runtimeInfo).toEqual("test_initial_runtime");
      });
      it("should change the loading status to 'error'", function() {
        expect(scope.monitor.loadingStatus).toEqual(jashboard.model.loadingStatus.error);
      });
      it("should set the error message into the scope", function() {
        expect(scope.errorMessage).toEqual("Error refreshing runtime information - test_message [test_error]");
        expect(scope.$apply).toHaveBeenCalled();
      });
    });
  });
});