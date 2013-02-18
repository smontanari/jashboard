describe("MonitorControllerDelegate", function() {
  var delegate, scope, repository, synchroniserFunction, testMonitor;

  beforeEach(function() {
    synchroniserFunction = jasmine.createSpy("synchroniserFunction");
    testMonitor = 
    {
      id: "test_id",
      name: "test.monitor",
      type: "test_type",
      runtimeInfoSynchroniser: function(callback) {
       callback();
       return synchroniserFunction;
      }
    };
    scope = jasmine.createSpyObj("scope", ['$apply', '$on']);
    repository = {
      loadMonitorRuntimeInfo: jasmine.createSpy("repository.loadMonitorRuntimeInfo()")
        .andCallFake(function(monitor_id, monitor_type, handler) {
          handler("testRuntimeInfo");
        })
    };
    delegate = new jashboard.MonitorControllerDelegate(repository);
  });

  describe("init", function() {
    describe("NewMonitorCreated event handler", function() {
      beforeEach(function() {
        scope.$on = jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
          handler({}, "dashboard2", testMonitor);
        });
        scope.dashboards = [
          {id: "dashboard1", monitors: [{id: "m1"}]},
          {id: "dashboard2", monitors: [{id: "m2"}]}
        ];

        delegate.init(scope);
      });
      it("should register a listener to the 'NewMonitorCreated'", function() {
        expect(scope.$on).toHaveBeenCalledWith("NewMonitorCreated", jasmine.any(Function));
      });
      it("should add the monitor to the dashboard", function() {
        expect(scope.dashboards[0].monitors.length).toEqual(1);
        expect(scope.dashboards[1].monitors.length).toEqual(2);
        expect(scope.dashboards[1].monitors).toContain(testMonitor);
      });
      it("should invoke the repository with monitor parameters", function() {
        expect(repository.loadMonitorRuntimeInfo).toHaveBeenCalledWith("test_id", "test_type", jasmine.any(Function));
      });
      it("should use the monitor runtimeInfoSynchroniser as a callback", function() {
        expect(synchroniserFunction).toHaveBeenCalledWith("testRuntimeInfo");
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
      expect(repository.loadMonitorRuntimeInfo).toHaveBeenCalledWith("test_id", "test_type", jasmine.any(Function));
    });
    it("should use the monitor runtimeInfoSynchroniser as a callback", function() {
      expect(synchroniserFunction).toHaveBeenCalledWith("testRuntimeInfo");
    });
    it("should syncronise the scope", function() {
      expect(scope.$apply).toHaveBeenCalled();
    });
  });
});