describe("DashboardController", function() {
  var scope;
  var controller;
  var resetScope = function() {
    scope = {};
  };

  beforeEach(function() {
    resetScope();
  });

  describe("Dashboard menu actions", function() {
    it("should open the dialog form", function() {
      var $stub = testHelper.stubJQuery(["#new-monitor-form"]);
      $stub.dialog = jasmine.createSpy("$.dialog()");
      controller = new jashboard.DashboardController(scope);

      scope.actionNewMonitor();

      expect($stub.dialog).toHaveBeenCalledWith("open");
    });
  });
});

