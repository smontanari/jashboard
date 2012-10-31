describe("MonitorController", function() {
  var scope = {};
  var controller;

  beforeEach(function() {
    controller = new jashboard.MonitorController(scope);
  });

  it("should put a new monitor into the scope", function() {
    expect(scope.newMonitor).toBeDefined();
  });
  describe("jQuery dialog initialization", function() {
    var $stub;
    var dialogWidget = {};
    beforeEach(function() {
      $stub = testHelper.stubJQuery(["#new-monitor-form", dialogWidget]);
      $stub.dialog = jasmine.createSpy("$.dialog()");
      //$stub.dialog = sinon.stub();
      scope.initMonitorFormDialog();
    });
    it("should initialize the dialog form with the correct width and height", function() {
      expect($stub.dialog.mostRecentCall.args[0].width).toEqual(500);
      expect($stub.dialog.mostRecentCall.args[0].height).toEqual(400);
      //expect($stub.dialog).toHaveBeenCalledWithArgumentMatching();
      //expect($stub.dialog).toBeAStubThatHasBeenCalledWith(sinon.match.has("width", 500));
      //expect($stub.dialog).toBeAStubThatHasBeenCalledWith(sinon.match.has("height", 400));
    });
    it("should initialize the dialog form with Save button", function() {
      expect($stub.dialog.mostRecentCall.args[0].buttons[0].text).toEqual("Save");
      //$stub.dialog.mostRecentCall.args[0].buttons[0].click.apply(dialogWidget);
    });
    it("should initialize the dialog form with Cancel button", function() {
      expect($stub.dialog.mostRecentCall.args[0].buttons[1].text).toEqual("Cancel");
      $stub.dialog.mostRecentCall.args[0].buttons[1].click.apply(dialogWidget);
      expect($stub.dialog).toHaveBeenCalledWith("close");
    });
  });
});
