describe("MainController", function() {
  var pluginManager, controller, scope, repository, dashboardDelegate;

  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ["$broadcast"]);
    repository = {};
    pluginManager = {
      getAllMonitorTypes: jasmine.createSpy("pluginManager.getAllMonitorTypes()")
        .andReturn(['test_type1', 'test_type2'])
    };
    dashboardDelegate = jasmine.createSpyObj("DashboardDelegate", ['init']);

    controller = new jashboard.MainController(scope, dashboardDelegate, pluginManager);
  });

  it("should inject the array of available monitor types into the scope", function() {
    expect(scope.availableMonitorTypes).toEqual(["test_type1", "test_type2"]);
  });

  it("should initialise a new DashboardScopeManager", function() {
    expect(dashboardDelegate.init).toHaveBeenCalledWith(scope);
  });

  describe("scope.menuAction()", function() {
    it("should broadcast the 'OpenDashboardDialog' event", function() {
      scope.menuAction('newDashboard');
      expect(scope.$broadcast).toHaveBeenCalledWith("OpenDashboardDialog");      
    });
  });
});
