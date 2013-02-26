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
      var testMonitor;
      beforeEach(function() {
        var monitorDomElement = {
          getAttribute: sinon.stub().withArgs("id").returns("m2")
        };
        testMonitor = {
          id: "m2",
          setPosition: jasmine.createSpy("monitor.setPosition()")
        };
        scope.dashboards = [
          {id: "dashboard1", monitors: [{id: "m1"}, testMonitor]},
          {id: "dashboard2", monitors: [{id: "m3"}]}
        ];
        scope.$on = jasmine.createSpy("scope.$on()").andCallFake(function(eventName, callback) {
          if (eventName === "MonitorPositionChanged") {
            callback({}, monitorDomElement, {top: 10, left: 20});
          }
        });

        delegate.init(scope);
      });
      it("should update the monitor position", function() {
        expect(testMonitor.setPosition).toHaveBeenCalledWith({top: 10, left: 20});
      });
      it("should invoke the repository", function() {
        expect(repository.updateMonitorPosition).toHaveBeenCalledWith("m2", {top: 10, left: 20});
      });
    });

    describe("'NewMonitorCreated' event handler", function() {
      beforeEach(function() {
        scope.$on = jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
          if (eventName === "NewMonitorCreated") {
            handler({}, "dashboard2", testMonitor);
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