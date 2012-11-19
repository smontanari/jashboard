describe("MenuController", function() {
  var scope;
  var controller;

  describe("Menu actions", function() {
    beforeEach(function() {
      scope = jasmine.createSpyObj("scope", ["$broadcast"]);
      controller = new jashboard.MenuController(scope);
    });

    it("should broadcast the 'OpenDashboardDialog' event", function() {
      scope.actionNewDashboard();
      expect(scope.$broadcast).toHaveBeenCalledWith("OpenDashboardDialog");
    });
  });
});

