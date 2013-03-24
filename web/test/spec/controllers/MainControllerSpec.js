describe("MainController", function() {
  var repository, controller, scope, 
      menuDelegate, dashboardDelegate, 
      locationService, listeners, scopeHelperSpy;

  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ['$apply', '$on', '$broadcast']);
    locationService = {id: "locationService"};
    repository = jasmine.createSpyObj("repository", ['loadDashboards']);
    menuDelegate = jasmine.createSpyObj("MenuControllerDelegate", ['init']);
    dashboardDelegate = jasmine.createSpyObj("DashboardActionsHandler", ['init']);
    listeners = {};
    scope.$on.andCallFake(function(eventName, fn) {
      listeners[eventName] = fn;
    });
    scopeHelperSpy = spyOn(jashboard.scopeContextHelper, "setDefaultActiveDashboard");

    controller = new jashboard.MainController(
      scope, locationService, menuDelegate, dashboardDelegate, repository);
  });

  it("should initialise a context object in the scope", function() {
    expect(scope.context).toEqual({});
  });
  it("should inject the locationService into the scope", function() {
    expect(scope.locationService).toEqual(locationService);
  });
  it("should initialise a new MenuControllerDelegate", function() {
    expect(menuDelegate.init).toHaveBeenCalledWith(scope);
  });
  it("should initialise a new DashboardControllerDelegate", function() {
    expect(dashboardDelegate.init).toHaveBeenCalledWith(scope);
  });

  describe("scope.isActiveDashboard()", function() {
    var innerScope;
    beforeEach(function() {
      scope.context.activeDashboardId = "current_dashboard";
    });
    it("should return the current dashboard as the active dashboard", function() {
      innerScope = {dashboard: {id: "current_dashboard"}};
      expect(scope.isActiveDashboard.apply(innerScope)).toBeTruthy();
    });
    it("should return another dashboard as not the active dashboard", function() {
      innerScope = {dashboard: {id: "another_dashboard"}};
      expect(scope.isActiveDashboard.apply(innerScope)).toBeFalsy();
    });
  });

  describe("scope.showDashboard()", function() {
    var innerScope;
    beforeEach(function() {
      innerScope = {dashboard: {id: "test_id"}};
      scope.showDashboard.apply(innerScope);
    });
    it("should set the active dashboard id to the current dashboard", function() {
      expect(scope.context.activeDashboardId).toEqual("test_id");
    });
    it("should broadcast the 'DashboardVisible' event", function() {
      expect(scope.$broadcast).toHaveBeenCalledWith("DashboardVisible", "test_id");
    });
  });

  describe("scope.loadData()", function() {
    it("should broadcast the 'DataLoadingStart' event", function() {
      scope.loadData();

      expect(scope.$broadcast).toHaveBeenCalledWith("DataLoadingStart");
    });
    describe("loadData successful", function() {
      var test_dashboards = [];
      beforeEach(function() {
        test_dashboards = [{id: "test.dashboard.1"}, {id: "test.dashboard.2"}];
        repository.loadDashboards = jasmine.createSpy("repository.loadDashboards()").andCallFake(function(handlers) {
          handlers.success(test_dashboards);
        });

        scope.loadData();
      });

      it("should load all the dashboards in the scope", function() {
        expect(scope.dashboards).toEqual(test_dashboards);
        expect(scope.$apply).toHaveBeenCalled();
      });
      it("should set the current active dashboard", function() {
        expect(scopeHelperSpy).toHaveBeenCalled();
        expect(scopeHelperSpy.calls[0].object).toEqual(scope);
      });
      it("should broadcast the 'DataLoadingComplete' event when data loading completes successfully", function() {
        expect(scope.$broadcast).toHaveBeenCalledWith("DataLoadingComplete");
      });
      it("should set the dataLoadingStatus to completed", function() {
        expect(scope.dataLoadingStatus).toEqual(jashboard.model.loadingStatus.completed);
      });
    });
    describe("loadData failure", function() {
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
  });
});
