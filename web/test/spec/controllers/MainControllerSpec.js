describe("MainController", function() {
  var pluginManager, repository, controller, scope, menuDelegate, dashboardDelegate, monitorDelegate;

  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ['$apply', '$on', '$broadcast']);
    repository = jasmine.createSpyObj("repository", ['loadDashboards']);
    pluginManager = {
      getAllMonitorTypes: jasmine.createSpy("pluginManager.getAllMonitorTypes()")
        .andReturn(['test_type1', 'test_type2'])
    };
    menuDelegate = jasmine.createSpyObj("MenuControllerDelegate", ['init']);
    dashboardDelegate = jasmine.createSpyObj("DashboardControllerDelegate", ['init']);
    monitorDelegate = jasmine.createSpyObj("MonitorControllerDelegate", ['init']);

    controller = new jashboard.MainController(
      scope, menuDelegate, dashboardDelegate, monitorDelegate, pluginManager, repository);
  });

  describe("dataLoad() successful", function() {
    var test_dashboards = [];
    beforeEach(function() {
      test_dashboards = [{id: "test.dashboard.1"}, {id: "test.dashboard.2"}];
      repository.loadDashboards = jasmine.createSpy("repository.loadDashboards()").andCallFake(function(handlers) {
        handlers.success(test_dashboards);
      });

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
  });

  describe("dataLoad() failure", function() {
    beforeEach(function() {
      repository.loadDashboards = jasmine.createSpy("repository.loadDashboards()").andCallFake(function(handlers) {
        handlers.error();
      });        
      scope.loadData();
    });
    it("should set the dataLoadingStatus to error", function() {
      expect(scope.dataLoadingStatus).toEqual(jashboard.model.loadingStatus.error);
    });
    it("should broadcast the 'DataLoadingError' event when data loading fails", function() {
      expect(scope.$broadcast).toHaveBeenCalledWith("DataLoadingError");
    });
  });

  it("should inject the array of available monitor types into the scope", function() {
    expect(scope.availableMonitorTypes).toEqual(["test_type1", "test_type2"]);
  });
  it("should initialise a new MenuControllerDelegate", function() {
    expect(menuDelegate.init).toHaveBeenCalledWith(scope);
  });
  it("should initialise a new DashboardControllerDelegate", function() {
    expect(dashboardDelegate.init).toHaveBeenCalledWith(scope);
  });
  it("should initialise the monitorControllerDelegate", function() {
    expect(monitorDelegate.init).toHaveBeenCalledWith(scope);
  });
});
