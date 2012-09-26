describe("DashboardController", function() {
  var scope = {};
  var httpService = {};
  var dashboards_data = [{name: "test.dashboard.1"}, {name: "test.dashboard.2"}];

  beforeEach(function() {
    scope.$apply = jasmine.createSpy();
    httpService.getJSON = jasmine.createSpy().andReturn({success: function(callBack) { callBack(dashboards_data); } });
    var ctrl = new jashboard.DashboardController(scope, httpService);
  });

  it("should invoke the http service with the correct url", function() {
    expect(httpService.getJSON).toHaveBeenCalledWith("/ajax/dashboards.json");
  });
  it("should populate the model with data returned from the http service", function() {
    expect(scope.dashboards).toEqual(dashboards_data);
  });
});