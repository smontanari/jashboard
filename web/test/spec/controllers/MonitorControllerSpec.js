describe("MonitorController", function() {
  var delegate, rootScope, scope, repository, alertService, testMonitor;

  beforeEach(function() {
    testMonitor = 
    {
      id: "test_id",
      name: "test.monitor",
      type: "test_type"
    };
    rootScope = jasmine.createSpyObj("rootScope", ['$broadcast']);
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

      new jashboard.MonitorController(rootScope, scope, repository);
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

  describe("scope.editMonitor()", function() {
    beforeEach(function() {
      scope.monitor = "test_monitor";

      new jashboard.MonitorController(rootScope, scope, repository);
      scope.editMonitor();
    });
    it("should broadcast the 'OpenMonitorDialog' event from the root scope with the given parameters", function() {
      expect(rootScope.$broadcast).toHaveBeenCalledWith("OpenMonitorDialog", {
        mode: jashboard.inputOptions.updateMode,
        parameters: {
          monitor: "test_monitor"
        }
      });
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

      new jashboard.MonitorController(rootScope, scope, repository, alertService, timeoutService);
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
      scope.monitor.runtimeUpdateScheduler = {id: "scheduler"};
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
      new jashboard.MonitorController(rootScope, scope, repository);
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
    var testSetup = function() {
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

      new jashboard.MonitorController(rootScope, scope, repository, alertService, timeoutService);
    };

    _.each(['success', 'error'], function(action) {
      beforeEach(function() {
        testSetup();
        scope.loadRuntimeInfo();
      });
      it("should save the scheduler into the monitor when data load is " + action, function() {
        handlers[action]();

        expect(scope.monitor.runtimeUpdateScheduler).toEqual(scheduler);
      });
      it("should schedule the data load after the given interval", function() {
        handlers[action]();

        expect(timeoutService).toHaveBeenCalledWith(jasmine.any(Function), 10000);
      });
      it("should schedule the call to the repository to load the data", function() {
        handlers[action]();

        scheduleFunction();

        expect(repository.loadMonitorRuntimeInfo).toHaveBeenCalledWith("test_id", "test_type", jasmine.any(Object));
        expect(timeoutService.calls.length).toEqual(2);
      });
      it("should not schedule a data load if the refresh interval is 0", function() {
        scope.monitor.refreshInterval = 0;
        
        handlers[action]();

        expect(timeoutService).not.toHaveBeenCalled();
      });
      it("should not schedule a data load if the refresh interval is not a finite number", function() {
        scope.monitor.refreshInterval = NaN;

        handlers[action]();

        expect(timeoutService).not.toHaveBeenCalled();
      });
    });
  });

  describe("scope.refreshRuntimeInfo()", function() {
    var handlers, timeoutService;
    beforeEach(function() {
      timeoutService = jasmine.createSpy("$timeout");
      repository.loadMonitorRuntimeInfo = jasmine.createSpy("repository.loadMonitorRuntimeInfo()")
          .andCallFake(function(monitor_id, monitor_type, callbacks) {
            handlers = callbacks;
          });

      new jashboard.MonitorController(rootScope, scope, repository);
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
      it("should not schedule the data load after the given interval", function() {
        handlers.success();

        expect(timeoutService).not.toHaveBeenCalled();
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
      it("should not schedule the data load after the given interval", function() {
        handlers.success();

        expect(timeoutService).not.toHaveBeenCalled();
      });
    });
  });
});