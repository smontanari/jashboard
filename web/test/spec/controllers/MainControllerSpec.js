describe("MainController", function() {
  var repository, controller, scope, menuDelegate, dashboardDelegate, monitorDelegate, locationService, listener;

  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ['$apply', '$on', '$broadcast']);
    locationService = {id: "locationService"};
    repository = jasmine.createSpyObj("repository", ['loadDashboards']);
    menuDelegate = jasmine.createSpyObj("MenuControllerDelegate", ['init']);
    dashboardDelegate = jasmine.createSpyObj("DashboardControllerDelegate", ['init']);
    monitorDelegate = jasmine.createSpyObj("MonitorControllerDelegate", ['init']);
    scope.$on = jasmine.createSpy().andCallFake(function(eventName, fn) {
      listener = fn;
    });

    controller = new jashboard.MainController(
      scope, locationService, menuDelegate, dashboardDelegate, monitorDelegate, repository);
  });

  it("should listen to the 'OverlayReady' event", function() {
    expect(scope.$on).toHaveBeenCalledWith("OverlayReady", jasmine.any(Function));
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
  it("should initialise the monitorControllerDelegate", function() {
    expect(monitorDelegate.init).toHaveBeenCalledWith(scope);
  });

  describe("'OverlayReady' event listener", function() {
    var eventObject = {};
    beforeEach(function() {
      eventObject.stopPropagation = jasmine.createSpy("event.stopPropagation()");
    });

    it("should broadcast the 'DataLoadingStart' event", function() {
      listener(eventObject);

      expect(scope.$broadcast).toHaveBeenCalledWith("DataLoadingStart");
    });
    it("should stop the 'OverlayReady' event propagation", function() {
      listener(eventObject);

      expect(eventObject.stopPropagation).toHaveBeenCalled();
    });
    describe("loadData successful", function() {
      var test_dashboards = [];
      beforeEach(function() {
        test_dashboards = [{id: "test.dashboard.1"}, {id: "test.dashboard.2"}];
        repository.loadDashboards = jasmine.createSpy("repository.loadDashboards()").andCallFake(function(handlers) {
          handlers.success(test_dashboards);
        });

        listener(eventObject);
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
    describe("loadData failure", function() {
      beforeEach(function() {
        repository.loadDashboards = jasmine.createSpy("repository.loadDashboards()").andCallFake(function(handlers) {
          handlers.error();
        });

        listener(eventObject);
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
