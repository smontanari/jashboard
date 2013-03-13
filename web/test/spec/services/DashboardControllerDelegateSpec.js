describe("DashboardControllerDelegate", function() {
  var delegate, repository, scope;

  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ['$apply', '$on', '$broadcast']);
    repository = jasmine.createSpyObj("repository", ['loadDashboards']);

    delegate = new jashboard.DashboardControllerDelegate(repository);
  });

  describe("scope.dashboardAction()", function() {
    it("should broadcast the 'OpenMonitorDialog' event", function() {
      delegate.init(scope);
      var innerScope = { dashboard: {id: "test_dashboard_id"} };
      scope.dashboardAction.apply(innerScope, ['newMonitor']);
      expect(scope.$broadcast).toHaveBeenCalledWith("OpenMonitorDialog", "test_dashboard_id");
    });
  });

  describe("'NewDashboardCreated' event handler", function() {
    var eventObject;
    beforeEach(function() {
      scope.$on = jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
        handler(eventObject, {dashboardData: "test.new.dashboard", monitors: []});
      });
      eventObject =  jasmine.createSpyObj("event", ['stopPropagation']);
      scope.dashboards = [];
      delegate.init(scope);
    });
    it("should register a listener to the 'NewDashboardCreated' event", function() {
      expect(scope.$on).toHaveBeenCalledWith("NewDashboardCreated", jasmine.any(Function));
    });
    it("should stop the event propagation", function() {
      expect(eventObject.stopPropagation).toHaveBeenCalled();
    });
    it("should add the dashboard to the scope", function() {
      expect(scope.dashboards.length).toEqual(1);
      expect(scope.dashboards).toContain({dashboardData: "test.new.dashboard", monitors: []});
      expect(scope.$apply).toHaveBeenCalled();
    });
  });
});
