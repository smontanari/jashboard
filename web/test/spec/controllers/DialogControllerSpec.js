describe("DialogController", function() {
  var scope = {};
  var controller;
  var $stub;
  var dialogWidget = {};

  beforeEach(function() {
    controller = new jashboard.DialogController(scope);
  });

  describe("Dashboard dialog initialization", function() {
    beforeEach(function() {
      $stub = testHelper.stubJQuery(["#new-dashboard-form", dialogWidget]);
      $stub.dialog = jasmine.createSpy("$.dialog()");
      scope.initDashboardFormDialog();
    });

    it("should initialize the dialog form with the correct width and height", function() {
      expect($stub.dialog.mostRecentCall.args[0].width).toEqual(500);
      expect($stub.dialog.mostRecentCall.args[0].height).toEqual(200);
    });
    it("should initialize the dialog form with Save button", function() {
      var button = $stub.dialog.mostRecentCall.args[0].buttons[0];
      expect(button.text).toEqual("Save");
      expect(button.id).toEqual("saveDashboard");
    });
  });

  describe("Monitor dialog initialization", function() {
    beforeEach(function() {
      $stub = testHelper.stubJQuery(["#new-monitor-form", dialogWidget]);
      $stub.dialog = jasmine.createSpy("$.dialog()");
      scope.initMonitorFormDialog();
    });
    it("should put a new monitor into the scope", function() {
      expect(scope.newMonitor).toBeDefined();
    });
    it("should initialize the dialog form with the correct width and height", function() {
      expect($stub.dialog.mostRecentCall.args[0].width).toEqual(500);
      expect($stub.dialog.mostRecentCall.args[0].height).toEqual(400);
    });
    it("should initialize the dialog form with Save button", function() {
      expect($stub.dialog.mostRecentCall.args[0].buttons[0].text).toEqual("Save");
    });
    it("should initialize the dialog form with Cancel button", function() {
      expect($stub.dialog.mostRecentCall.args[0].buttons[1].text).toEqual("Cancel");
      $stub.dialog.mostRecentCall.args[0].buttons[1].click.apply(dialogWidget);
      expect($stub.dialog).toHaveBeenCalledWith("close");
    });
  });
});
