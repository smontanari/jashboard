describe("DashboardControllerDelegate", function() {
  var delegate, repository, scope;

  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ['$apply', '$on', '$broadcast', '$evalAsync']);
    repository = jasmine.createSpyObj("repository", ['loadDashboards']);

    delegate = new jashboard.DashboardControllerDelegate(repository);
  });

  describe("Dashboard data loading successfully", function() {
    var test_dashboards = [];
    beforeEach(function() {
      test_dashboards = [{id: "test.dashboard.1"}, {id: "test.dashboard.2"}];
      repository.loadDashboards = jasmine.createSpy("repository.loadDashboards()").andCallFake(function(handlers) {
        handlers.success(test_dashboards);
      });

      delegate.init(scope);
      scope.loadDashboardData();
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
  });
  describe("Dashboard data loading failure", function() {
    beforeEach(function() {
      repository.loadDashboards = jasmine.createSpy("repository.loadDashboards()").andCallFake(function(handlers) {
        handlers.error();
      });        
      delegate.init(scope);
      scope.loadDashboardData();
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
