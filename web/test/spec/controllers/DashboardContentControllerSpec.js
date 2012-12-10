describe("DashboardContentController", function() {
  var scope;
  var controller;

  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ["$broadcast"]);
    controller = new jashboard.DashboardContentController(scope);
  });

  describe("Dashboard actions", function() {
    it("should broadcast the 'OpenMonitorDialog' event", function() {
      scope.actionNewMonitor();
      expect(scope.$broadcast).toHaveBeenCalledWith("OpenMonitorDialog");
    });
  });

  describe("Runtime View", function() {
    it("should return the view corresponding to the current monitor in scope", function() {
      scope.monitor = {type: "test_type"};

      expect(scope.monitorRuntimeView()).toEqual("html/plugins/test_type/monitor_runtime_view.html");
    });
  });
});
