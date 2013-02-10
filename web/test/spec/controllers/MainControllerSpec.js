describe("MainController", function() {
  var pluginManager = {};
  var controller, scope, repository, overlayService;

  var resetScope = function() {
    scope = jasmine.createSpyObj("scope", ['$apply', '$on']);
  };
  beforeEach(function() {
    overlayService = jasmine.createSpyObj("overlayService", ['show', 'hide']);
  });

  describe("Initialisation", function() {
    beforeEach(function() {
      resetScope();
      repository = jasmine.createSpyObj("repository", ['loadDashboards']);
      pluginManager.getAllMonitorTypes = jasmine.createSpy("pluginManager.getAllMonitorTypes()")
        .andReturn(['test_type1', 'test_type2']);

      controller = new jashboard.MainController(scope, repository, overlayService, pluginManager);
    });
    it("should inject the array of available monitor types into the scope", function() {
      expect(scope.availableMonitorTypes).toEqual(["test_type1", "test_type2"]);
    });
    it("should show the overlay with the waiting message", function() {
      expect(overlayService.show).toHaveBeenCalledWith("#waiting-overlay");
    });
  });

  describe("Loading data", function() {
    var test_dashboards = [];
    var test_monitors = [];
    beforeEach(function() {
      resetScope();
      test_monitors = _.map([1, 2, 3], function(index) {
        return {
          id: "test.monitor." + index,
          type: "type" + index,
          updateRuntimeInfo: jasmine.createSpy("monitor" + index + ".updateRuntimeInfo()")
        };
      });
      test_dashboards = [
        {id: "test.dashboard.1", monitors: [
          test_monitors[0], test_monitors[1]]
        },
        {id: "test.dashboard.2", monitors: [test_monitors[2]]}
      ];
      pluginManager.getAllMonitorTypes = jasmine.createSpy();
      repository.loadDashboards = jasmine.createSpy("repository.loadDashboards()").andCallFake(function(handler) {
        handler(test_dashboards);
      });
      repository.loadMonitorRuntimeInfo = jasmine.createSpy("repository.loadMonitorRuntimeInfo()")
        .andCallFake(function(monitor_id, monitor_type, handler) {
        handler("runtimeInfo_" + monitor_id + "_" + monitor_type);
      });

      controller = new jashboard.MainController(scope, repository, overlayService, pluginManager);
    });

    it("should populate the model with dashboard data returned from the repository", function() {
      expect(scope.dashboards).toEqual(test_dashboards);
      expect(scope.$apply).toHaveBeenCalled();
    });
    it("should hide the overlay with the waiting message", function() {
      expect(overlayService.hide).toHaveBeenCalled();
    });
    it("should update the monitor runtime info with data returned from the repository", function() {
      _.each(test_monitors, function(test_monitor, index) {
        expect(test_monitor.updateRuntimeInfo)
          .toHaveBeenCalledWith("runtimeInfo_test.monitor." + (index + 1) + "_type" + (index + 1));
      });
      expect(scope.$apply).toHaveBeenCalled();
    });
  });

  describe("Events handling", function() {
    beforeEach(function() {
      resetScope();
      pluginManager.getAllMonitorTypes = jasmine.createSpy();
      repository = jasmine.createSpyObj("repository", ["loadDashboards", "loadMonitorRuntime"]);

    });
    
    describe("NewDashboardCreated event handler", function() {
      beforeEach(function() {
        scope.$on = jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
          if (eventName === "NewDashboardCreated") {
            handler({}, {dashboardData: "test.new.dashboard", monitors: []});
          }
        });
        scope.dashboards = [];
        controller = new jashboard.MainController(scope, repository, overlayService, pluginManager);
      });
      it("should register a listener to the 'NewDashboardCreated'", function() {
        expect(scope.$on).toHaveBeenCalledWith("NewDashboardCreated", jasmine.any(Function));
      });
      it("should register a listener to the 'NewDashboardCreated' that adds the dashboard to the scope", function() {
        expect(scope.dashboards.length).toEqual(1);
        expect(scope.dashboards).toContain({dashboardData: "test.new.dashboard", monitors: []});
        expect(scope.$apply).toHaveBeenCalled();
      });
    });

    describe("NewMonitorCreated event handler", function() {
      var newMonitor;
      beforeEach(function() {
        newMonitor = 
        {
          id: "m3",
          name: "test.new.monitor",
          type: "test_type",
          updateRuntimeInfo: jasmine.createSpy("monitor.updateRuntimeInfo()")
        };
        scope.$on = jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
          if (eventName === "NewMonitorCreated") {
            handler({}, "dashboard2", newMonitor);
          }
        });
        scope.dashboards = [
          {id: "dashboard1", monitors: [{id: "m1"}]},
          {id: "dashboard2", monitors: [{id: "m2"}]}
        ];
        repository.loadMonitorRuntimeInfo = jasmine.createSpy("repository.loadMonitorRuntimeInfo()")
          .andCallFake(function(monitor_id, monitor_type, handler) {
          handler("runtimeInfo_" + monitor_id + "_" + monitor_type);
        });

        controller = new jashboard.MainController(scope, repository, overlayService, pluginManager);
      });
      it("should register a listener to the 'NewMonitorCreated'", function() {
        expect(scope.$on).toHaveBeenCalledWith("NewMonitorCreated", jasmine.any(Function));
      });
      it("should register a listener to the 'NewMonitorCreated' that adds the monitor to the dashboard", function() {
        expect(scope.dashboards[0].monitors.length).toEqual(1);
        expect(scope.dashboards[1].monitors.length).toEqual(2);
        expect(scope.dashboards[1].monitors).toContain(newMonitor);
        expect(newMonitor.updateRuntimeInfo).toHaveBeenCalledWith("runtimeInfo_m3_test_type");
        expect(scope.$apply).toHaveBeenCalled();
      });
    });
  });
});
