describe("DashboardControllerDelegate", function() {
  var delegate, repository, scope, monitorControllerDelegate;

  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ['$apply', '$on', '$broadcast', '$evalAsync']);
    monitorControllerDelegate = jasmine.createSpyObj("monitorControllerDelegate", ['init', 'updateMonitorRuntime']);
    repository = jasmine.createSpyObj("repository", ['loadDashboards']);

    delegate = new jashboard.DashboardControllerDelegate(repository, monitorControllerDelegate);
  });

  describe("Initialisation", function() {
    it("should initialise the monitorControllerDelegate", function() {
      delegate.init(scope);
      expect(monitorControllerDelegate.init).toHaveBeenCalledWith(scope);
    });
  });
  describe("Dashboard data loading successfully", function() {
    var test_dashboards = [];
    beforeEach(function() {
      test_dashboards = [
        {id: "test.dashboard.1", monitors: ["test_monitor1", "test_monitor2"]},
        {id: "test.dashboard.2", monitors: ["test_monitor3"]}
      ];
      repository.loadDashboards = jasmine.createSpy("repository.loadDashboards()").andCallFake(function(handlers) {
        handlers.success(test_dashboards);
      });

      delegate.init(scope);
      scope.loadData();
    });

    it("should broadcast the 'DataLoadingStart' event", function() {
      expect(scope.$broadcast).toHaveBeenCalledWith("DataLoadingStart");
    });
    it("should load all the dashboards in the scope", function() {
      expect(scope.dashboards).toEqual(test_dashboards);
      expect(scope.$apply).toHaveBeenCalled();
    });
    it("should broadcast the 'DataLoadingComplete' event when data loading completes successfully", function() {
      expect(scope.$broadcast).toHaveBeenCalledWith("DataLoadingComplete");
    });
    it("should set the dataLoadingStatus to completed", function() {
      expect(scope.dataLoadingStatus).toEqual(jashboard.model.loadingStatus.completed);
    });
    it("should update the monitor runtime", function() {
      expect(monitorControllerDelegate.updateMonitorRuntime).toHaveBeenCalledWith(scope, "test_monitor1");
      expect(monitorControllerDelegate.updateMonitorRuntime).toHaveBeenCalledWith(scope, "test_monitor2");
      expect(monitorControllerDelegate.updateMonitorRuntime).toHaveBeenCalledWith(scope, "test_monitor3");
      expect(scope.$apply).toHaveBeenCalled();
    });
  });
  describe("Dashboard data loading failure", function() {
    beforeEach(function() {
      repository.loadDashboards = jasmine.createSpy("repository.loadDashboards()").andCallFake(function(handlers) {
        handlers.error();
      });        
      delegate.init(scope);
      scope.loadData();
    });
    it("should set the dataLoadingStatus to error", function() {
      expect(scope.dataLoadingStatus).toEqual(jashboard.model.loadingStatus.error);
    });
    it("should broadcast the 'DataLoadingError' event when data loading fails", function() {
      expect(scope.$broadcast).toHaveBeenCalledWith("DataLoadingError");
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
