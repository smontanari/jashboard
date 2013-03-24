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
    var innerScope = {}, deleteHandlers, alertOptions;
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
      innerScope.dashboard = {id: "test_dashboard", monitors: [{id: "m1"}, {id: "m2"}, testMonitor]};
      innerScope.monitor = testMonitor;

      new jashboard.MonitorController(scope, repository, alertService);
      scope.removeMonitor.apply(innerScope);
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

      expect(innerScope.dashboard.monitors).toEqual([{id: "m1"}, {id: "m2"}]);
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
    it("should fire the 'AjaxError' event when failing to remove the monitor", function() {
      alertOptions.confirmAction();
      deleteHandlers.error();

      expect(scope.$emit).toHaveBeenCalledWith("AjaxError");
    });
  });

  describe("scope.loadRuntimeInfo()", function() {
    var innerScope;
    beforeEach(function() {
      innerScope = {
        monitor: {}
      }
      new jashboard.MonitorController(scope, repository);
    });
    it ("should not start loading the data if the monitor loading status is completed", function() {
      innerScope.monitor.loadingStatus = jashboard.model.loadingStatus.completed;
      
      scope.loadRuntimeInfo.apply(innerScope);

      expect(repository.loadMonitorRuntimeInfo).not.toHaveBeenCalled();
    });
    it ("should not start loading the data if the monitor loading status is waiting", function() {
      innerScope.monitor.loadingStatus = jashboard.model.loadingStatus.waiting;
      
      scope.loadRuntimeInfo.apply(innerScope);

      expect(repository.loadMonitorRuntimeInfo).not.toHaveBeenCalled();
    });
  });

  describe("scope.refreshRuntimeInfo()", function() {
    var runtimeSynchHandlers, innerScope = jasmine.createSpyObj("innerScope", ['$apply', '$broadcast']);
    beforeEach(function() {
      repository.loadMonitorRuntimeInfo = jasmine.createSpy("repository.loadMonitorRuntimeInfo()")
          .andCallFake(function(monitor_id, monitor_type, handlers) {
            runtimeSynchHandlers = handlers;
          });

      new jashboard.MonitorController(scope, repository);
      innerScope.monitor = testMonitor;
      testMonitor.runtimeInfo = "test_initial_runtime";

      scope.refreshRuntimeInfo.apply(innerScope);
    });
    it("should invoke the repository", function() {
      expect(repository.loadMonitorRuntimeInfo).toHaveBeenCalledWith("test_id", "test_type", jasmine.any(Object));
    });
    it("should set the loadingStatus to 'waiting'", function() {
      expect(innerScope.monitor.loadingStatus).toEqual(jashboard.model.loadingStatus.waiting);
    });

    describe("on success", function() {
      beforeEach(function () {
        runtimeSynchHandlers.success({testRuntimeInfo: "test"});
      });
      it("should update the runtime data", function() {
        expect(testMonitor.runtimeInfo).toEqual({testRuntimeInfo: "test"});
      });
      it("change the loading status to 'completed'", function() {
        expect(innerScope.monitor.loadingStatus).toEqual(jashboard.model.loadingStatus.completed);
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
        expect(innerScope.monitor.loadingStatus).toEqual(jashboard.model.loadingStatus.error);
      });
      it("should set the error message into the scope", function() {
        expect(innerScope.errorMessage).toEqual("Error refreshing runtime information - test_message [test_error]");
        expect(innerScope.$apply).toHaveBeenCalled();
      });
    });
  });
});