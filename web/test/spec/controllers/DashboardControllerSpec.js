describe("DashboardController", function() {
  var scope = {};
  var httpService = {};
  var FakeDashboard = function(data) {
    this.dashboardName = data.name;
  };
  var dashboards_data = [{name: "test.dashboard.1", }, {name: "test.dashboard.2"}];

  beforeEach(function() {
    scope.$apply = jasmine.createSpy();
    httpService.getJSON = jasmine.createSpy().andReturn({success: function(callBack) { callBack(dashboards_data); } });
    spyOn(jashboard.model, "Dashboard").andCallFake(FakeDashboard) 
    var ctrl = new jashboard.DashboardController(scope, httpService);
  });

  it("should invoke the http service with the correct url", function() {
    expect(httpService.getJSON).toHaveBeenCalledWith("/ajax/dashboards");
  });
  it("should populate the model with data returned from the http service", function() {
    expect(scope.dashboards).toEqual([{dashboardName: "test.dashboard.1"}, {dashboardName: "test.dashboard.2"}]);
  });
});
