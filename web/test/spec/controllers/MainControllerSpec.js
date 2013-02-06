describe("MainController", function() {
  var repository = {};
  var pluginManager = {};
  var controller, scope;

  var resetScope = function() {
    scope = jasmine.createSpyObj("scope", ['$apply', '$on']);
  };

  describe("Initialisation", function() {
    it("should inject the array of available monitor types into the scope", function() {
      resetScope();
      repository = jasmine.createSpyObj("repository", ['loadDashboards']);
      pluginManager.getAllMonitorTypes = jasmine.createSpy("pluginManager.getAllMonitorTypes()")
        .andReturn(['test_type1', 'test_type2']);

      controller = new jashboard.MainController(scope, repository, pluginManager);

      expect(scope.availableMonitorTypes).toEqual(["test_type1", "test_type2"]);
    });
  });

  describe("Loading data", function() {
    var test_dashboards = [
      {dashboardData: "test.dashboard.1", monitors: [
        {id: "test.monitor.1", type: "type1"}, {id: "test.monitor.2", type: "type2"}]
      },
      {dashboardData: "test.dashboard.2", monitors: [{id: "test.monitor.3", type: "type3"}]}
    ];
    beforeEach(function() {
      resetScope();
      pluginManager.getAllMonitorTypes = jasmine.createSpy();
      repository.loadDashboards = jasmine.createSpy("repository.loadDashboards").andCallFake(function(handler) {
        handler(test_dashboards);
      });
      repository.loadMonitorRuntimeInfo = jasmine.createSpy("repository.loadMonitorRuntimeInfo")
        .andCallFake(function(monitor_id, monitor_type, handler) {
        handler("runtimeInfo_" + monitor_id + "_" + monitor_type);
      });
      controller = new jashboard.MainController(scope, repository, pluginManager);
    });

    it("should populate the model with dashboard data returned from the repository", function() {
      expect(scope.dashboards).toEqual(test_dashboards);
      expect(scope.$apply).toHaveBeenCalled();
    });

    it("should update the monitor runtime info with data returned from the repository", function() {
      expect(scope.dashboards[0].monitors).toEqual([
        {id: "test.monitor.1", type: "type1", runtimeInfo: "runtimeInfo_test.monitor.1_type1"}, 
        {id: "test.monitor.2", type: "type2", runtimeInfo: "runtimeInfo_test.monitor.2_type2"}
      ]);
      expect(scope.dashboards[1].monitors).toEqual([
        {id: "test.monitor.3", type: "type3", runtimeInfo: "runtimeInfo_test.monitor.3_type3"}
      ]);
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
        controller = new jashboard.MainController(scope, repository, pluginManager);
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
      beforeEach(function() {
        scope.$on = jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
          if (eventName === "NewMonitorCreated") {
            handler({}, "dashboard2", {id: "m3", name: "test.new.monitor", type: "test_type"});
          }
        });
        scope.dashboards = [
          {id: "dashboard1", monitors: [{id: "m1"}]},
          {id: "dashboard2", monitors: [{id: "m2"}]}
        ];
        repository.loadMonitorRuntimeInfo = jasmine.createSpy("repository.loadMonitorRuntimeInfo")
          .andCallFake(function(monitor_id, monitor_type, handler) {
          handler("runtimeInfo_" + monitor_id + "_" + monitor_type);
        });

        controller = new jashboard.MainController(scope, repository, pluginManager);
      });
      it("should register a listener to the 'NewMonitorCreated'", function() {
        expect(scope.$on).toHaveBeenCalledWith("NewMonitorCreated", jasmine.any(Function));
      });
      it("should register a listener to the 'NewMonitorCreated' that adds the monitor to the dashboard", function() {
        expect(scope.dashboards[0].monitors.length).toEqual(1);
        expect(scope.dashboards[1].monitors.length).toEqual(2);
        expect(scope.dashboards[1].monitors).toContain(
          {id: "m3", name: "test.new.monitor", type: "test_type", runtimeInfo: "runtimeInfo_m3_test_type"});
        expect(scope.$apply).toHaveBeenCalled();
      });
    });
  });
});
