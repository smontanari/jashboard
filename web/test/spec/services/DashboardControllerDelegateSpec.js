describe("DashboardControllerDelegate", function() {
  var delegate, repository, scope, monitorControllerDelegate;

  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ['$apply', '$on', '$broadcast', '$evalAsync']);
    monitorControllerDelegate = jasmine.createSpyObj("monitorControllerDelegate", ['init', 'updateMonitorRuntime']);
    repository = jasmine.createSpyObj("repository", ['loadDashboards']);

    delegate = new jashboard.DashboardControllerDelegate(repository, monitorControllerDelegate);
  });

  describe("Initialisation", function() {
    var test_dashboards = [];
    beforeEach(function() {
      test_dashboards = [
        {id: "test.dashboard.1", monitors: ["test_monitor1", "test_monitor2"]},
        {id: "test.dashboard.2", monitors: ["test_monitor3"]}
      ];
      repository.loadDashboards = jasmine.createSpy("repository.loadDashboards()").andCallFake(function(handler) {
        handler(test_dashboards);
      });
    });

    it("should broadcast the 'DataLoadingStart' event", function() {
      scope.$evalAsync = jasmine.createSpy().andCallFake(function(fn) {
        fn(scope);
      })

      delegate.init(scope);

      expect(scope.$broadcast).toHaveBeenCalledWith("DataLoadingStart");
    });

    it("should load all the dashboards in the scope", function() {
      delegate.init(scope);

      expect(scope.dashboards).toEqual(test_dashboards);
      expect(scope.$apply).toHaveBeenCalled();
    });
    it("should broadcast the 'DataLoadingComplete' event", function() {
      delegate.init(scope);

      expect(scope.$broadcast).toHaveBeenCalledWith("DataLoadingComplete");
    });
    it("should initialise the monitorControllerDelegate", function() {
      delegate.init(scope);
      expect(monitorControllerDelegate.init).toHaveBeenCalledWith(scope);
    });
    it("should update the monitor runtime", function() {
      delegate.init(scope);

      expect(monitorControllerDelegate.updateMonitorRuntime).toHaveBeenCalledWith(scope, "test_monitor1");
      expect(monitorControllerDelegate.updateMonitorRuntime).toHaveBeenCalledWith(scope, "test_monitor2");
      expect(monitorControllerDelegate.updateMonitorRuntime).toHaveBeenCalledWith(scope, "test_monitor3");
      expect(scope.$apply).toHaveBeenCalled();
    });
  });

  describe("'NewDashboardCreated' event handler", function() {
    beforeEach(function() {
      scope.$on = jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
        handler({}, {dashboardData: "test.new.dashboard", monitors: []});
      });
      scope.dashboards = [];
      delegate.init(scope);
    });
    it("should register a listener to the 'NewDashboardCreated' event", function() {
      expect(scope.$on).toHaveBeenCalledWith("NewDashboardCreated", jasmine.any(Function));
    });
    it("should add the dashboard to the scope", function() {
      expect(scope.dashboards.length).toEqual(1);
      expect(scope.dashboards).toContain({dashboardData: "test.new.dashboard", monitors: []});
      expect(scope.$apply).toHaveBeenCalled();
    });
  });

});