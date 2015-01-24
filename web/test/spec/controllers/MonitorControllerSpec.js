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
    scope = jasmine.createSpyObj("scope", ['$apply', '$on', '$emit', '$watch']);
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
      scope.$on = jasmine.createSpy("scope.$on()").and.callFake(function(eventName, callback) {
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
        mode: jashboard.model.inputOptions.updateMode,
        parameters: {
          monitor: "test_monitor"
        }
      });
    });
  });

  describe("scope.removeMonitor()", function() {
    var deleteHandlers, alertOptions;
    beforeEach(function() {
      alertService = {
        showAlert: jasmine.createSpy("alertService.showAlert()").and.callFake(function(options) {
          alertOptions = options;
        })
      };
      repository = {
          deleteMonitor: jasmine.createSpy("repository.deleteMonitor()").and.callFake(function(dashboard_id, monitor_id, handlers) {
            deleteHandlers = handlers;
          })
      };
      monitorScheduler = jasmine.createSpyObj("MonitorScheduler", ['scheduleUpdate', 'cancelUpdateSchedule']);
      scope.dashboard = {id: "test_dashboard", monitors: [{id: "m1"}, {id: "m2"}, testMonitor]};
      scope.monitor = testMonitor;

      new jashboard.MonitorController(rootScope, scope, repository, alertService, monitorScheduler);
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

      expect(monitorScheduler.cancelUpdateSchedule).toHaveBeenCalledWith(testMonitor);
    });
    it("should fire the 'AjaxError' event when failing to remove the monitor", function() {
      alertOptions.confirmAction();
      deleteHandlers.error();

      expect(scope.$emit).toHaveBeenCalledWith("AjaxError");
    });
  });

  describe("Configuration change", function() {
    var configurationWatcher, scheduleFunction, monitorScheduler;
    beforeEach(function() {
      scope.$watch = jasmine.createSpy("scope.$watch()").and.callFake(function(expr, listener) {
        if (expr === "monitor.configuration") configurationWatcher = listener;
      });
      monitorScheduler = jasmine.createSpyObj("MonitorScheduler", ['scheduleUpdate', 'cancelUpdateSchedule']);
      monitorScheduler.scheduleUpdate.and.callFake(function(monitor, callback) {
        scheduleFunction = callback;
      });
      scope.monitor = {
        id: "test_id",
        type: "test_type"
      };

      new jashboard.MonitorController(rootScope, scope, repository, alertService, monitorScheduler);
    });

    it ("should watch monitor.configuration", function() {
      expect(scope.$watch).toHaveBeenCalledWith("monitor.configuration", jasmine.any(Function));
    });

    describe('valid configuration object', function() {
      it("starts the data loading when the configuration changes", function() {
        configurationWatcher({});

        expect(repository.loadMonitorRuntimeInfo).toHaveBeenCalled();
      });

      it("should cancel a previously defined update schedule", function() {
        configurationWatcher({});

        expect(monitorScheduler.cancelUpdateSchedule).toHaveBeenCalledWith(scope.monitor);
      });

      describe('schedule update', function() {
        beforeEach(function() {
          repository.loadMonitorRuntimeInfo = jasmine.createSpy("repository.loadMonitorRuntimeInfo()")
            .and.callFake(function(monitor_id, monitor_type, callbacks) {
              handlers = callbacks;
            });
          configurationWatcher({});
        });

        it("schedules the update after the given interval", function() {
          expect(monitorScheduler.scheduleUpdate).toHaveBeenCalledWith(scope.monitor, jasmine.any(Function));
        });

        it("schedules a new update", function() {
          scheduleFunction();

          expect(repository.loadMonitorRuntimeInfo).toHaveBeenCalledWith("test_id", "test_type", jasmine.any(Object));
        });
      });
    });

    describe('null configuration object', function() {
      it("should not start the data loading if the configuration has not been defined", function() {
        configurationWatcher(null);

        expect(repository.loadMonitorRuntimeInfo).not.toHaveBeenCalled();
      });

      it("does not cancel the update schedule", function() {
        configurationWatcher(null);

        expect(monitorScheduler.cancelUpdateSchedule).not.toHaveBeenCalled();
      });

      it("does not schedule a new update", function() {
        configurationWatcher(null);

        expect(monitorScheduler.scheduleUpdate).not.toHaveBeenCalled();
      });
    });
  });

  describe("scope.refreshRuntimeInfo()", function() {
    var handlers;
    beforeEach(function() {
      repository.loadMonitorRuntimeInfo = jasmine.createSpy("repository.loadMonitorRuntimeInfo()")
          .and.callFake(function(monitor_id, monitor_type, callbacks) {
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
    });

    describe("on failure", function() {
      beforeEach(function () {
        handlers.error("test_status", "test_message", "test error longer than the max number of characters");
      });
      it("should not change the runtime data", function() {
        expect(testMonitor.runtimeInfo).toEqual("test_initial_runtime");
      });
      it("should change the loading status to 'error'", function() {
        expect(scope.monitor.loadingStatus).toEqual(jashboard.model.loadingStatus.error);
      });
      it("should set the error message into the scope", function() {
        expect(scope.errorMessage).toEqual("Error refreshing runtime information - test_message [test error longer than the max...]");
        expect(scope.$apply).toHaveBeenCalled();
      });
    });
  });
});