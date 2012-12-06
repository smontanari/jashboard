describe("MainController", function() {
  var scope;
  var repository = {};
  var controller;
  var resetScope = function() {
    scope = jasmine.createSpyObj("scope", ['$apply', '$on']);
  };

  describe("Loading data", function() {
    var test_dashboards = [
      {dashboardData: "test.dashboard.1", monitors: [
        {id: "test.monitor.1", type: "type1"}, {id: "test.monitor.2", type: "type2"}]
      },
      {dashboardData: "test.dashboard.2", monitors: [{id: "test.monitor.3", type: "type3"}]}
    ];
    beforeEach(function() {
      resetScope();
      repository.loadDashboards = jasmine.createSpy("repository.loadDashboards").andCallFake(function(handler) {
        handler(test_dashboards);
      });
      repository.loadMonitorRuntimeInfo = jasmine.createSpy("repository.loadMonitorRuntimeInfo")
        .andCallFake(function(monitor_id, monitor_type, handler) {
        handler("runtimeInfo_" + monitor_id + "_" + monitor_type);
      });
      controller = new jashboard.MainController(scope, repository);
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

  describe("Event registration", function() {
    beforeEach(function() {
      resetScope();
      repository = jasmine.createSpyObj("repository", ["loadDashboards", "loadMonitorRuntime"]);

      scope.$on = jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
        handler({}, {dashboardData: "test.new.dashboard", monitors: []});
      });
      controller = new jashboard.MainController(scope, repository);
    });
    it("should register a listener to the 'NewDashboardEvent'", function() {
      expect(scope.$on).toHaveBeenCalledWith("NewDashboardEvent", jasmine.any(Function));
    });
    it("should register a listener to the 'NewDashboardEvent' that adds the dashboard to the scope", function() {
      expect(scope.dashboards.length).toEqual(1);
      expect(scope.dashboards).toContain({dashboardData: "test.new.dashboard", monitors: []});
      expect(scope.$apply).toHaveBeenCalled();
    });
  });
});
