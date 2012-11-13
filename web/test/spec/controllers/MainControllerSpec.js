describe("MainController", function() {
  var scope;
  var repository = {};
  var controller;
  var test_dashboards = [
    {dashboardData: "test.dashboard.1", monitors: [{id: "test.monitor.1"}, {id: "test.monitor.2"}]},
    {dashboardData: "test.dashboard.2", monitors: [{id: "test.monitor.3"}]}
  ];
  var resetScope = function() {
    scope = {};
    scope.$apply = jasmine.createSpy();
  };

  beforeEach(function() {
    resetScope();
    repository.loadDashboards = jasmine.createSpy("repository.loadDashboards").andCallFake(function(handler) {
      handler(test_dashboards);
    });
    repository.loadMonitorRuntime = jasmine.createSpy("repository.loadMonitorRuntime").andCallFake(function(monitor_id, handler) {
      handler("runtimeInfo_" + monitor_id);
    });
    controller = new jashboard.MainController(scope, repository);
  });

  it("should populate the model with dashboard data returned from the repository", function() {
    expect(scope.dashboards).toEqual(test_dashboards);
  });

  it("should update the monitor runtime info with data returned from the repository", function() {
    expect(scope.dashboards[0].monitors).toEqual([{id: "test.monitor.1", runtimeInfo: "runtimeInfo_test.monitor.1"}, {id: "test.monitor.2", runtimeInfo: "runtimeInfo_test.monitor.2"}]);
    expect(scope.dashboards[1].monitors).toEqual([{id: "test.monitor.3", runtimeInfo: "runtimeInfo_test.monitor.3"}]);
  });
});
