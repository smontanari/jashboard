describe("scopeHelper", function() {
  describe("setDefaultActiveDashboard()", function() {
    var scope;
    beforeEach(function() {
      scope = {context: {}};
    });

    it("should not set a current active dashboard", function() {
      scope.dashboards = [];

      jashboard.scopeContextHelper.setDefaultActiveDashboard.apply(scope);

      expect(scope.context.activeDashboardId).toBeUndefined();
    });

    it("should set the current active dashboard to the first available dashboard", function() {
      scope.dashboards = [{id: "dashboard_1"}, {id: "dashboard_2"}];

      jashboard.scopeContextHelper.setDefaultActiveDashboard.apply(scope);

      expect(scope.context.activeDashboardId).toEqual("dashboard_1");
    });
  });
});