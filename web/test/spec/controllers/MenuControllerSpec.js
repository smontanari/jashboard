describe("MenuController", function() {
  var scope;
  var controller;

  describe("Menu actions", function() {
    beforeEach(function() {
      scope = {};
      controller = new jashboard.MenuController(scope);
    });

    it("should open the dashboard dialog form", function() {
      var $stub = testHelper.stubJQuery(["#new-dashboard-form"]);
      $stub.dialog = jasmine.createSpy("$.dialog()");

      scope.actionNewDashboard();

      expect($stub.dialog).toHaveBeenCalledWith("open");
    });
  });
});

