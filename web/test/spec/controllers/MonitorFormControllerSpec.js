describe("MonitorFormController", function() {
  var scope;
  var controller;
  var $stub;
  var repository = {};

  var resetScope = function() {
    $stub = testHelper.stubJQuery(["#new-monitor-form"]);
    $stub.modal = jasmine.createSpy("$.modal()");
  };

  beforeEach(function() {
    resetScope();
  });

  describe("'OpenMonitorDialog' event listener", function() {
    beforeEach(function() {
      scope = {};
      scope.$on = jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
        handler();
      });
    });
    it("should open the modal dialog", function() {
      controller = new jashboard.MonitorFormController(scope, repository);
      expect(scope.$on).toHaveBeenCalledWith("OpenMonitorDialog", jasmine.any(Function));
      expect($stub.modal).toHaveBeenCalledWith("show");
    });
    it("should reset the monitorForm variable in the scope", function() {
      scope.monitorForm = {test: "test"};
      controller = new jashboard.MonitorFormController(scope, repository);
      expect(scope.monitorForm).toEqual({});
    });
  });

  describe("saveMonitor", function() {
    beforeEach(function() {
      scope = jasmine.createSpyObj("scope", ['$on', '$emit']);
      repository.createMonitor = jasmine.createSpy("repository.createMonitor").andCallFake(function(input, handler) {
        handler("test.monitor");
      });
      controller = new jashboard.MonitorFormController(scope, repository);

      scope.saveMonitor({name: "test.name"});
    });

    it("should call the repository to create a monitor", function() {
      expect(repository.createMonitor).toHaveBeenCalledWith({name: "test.name"}, jasmine.any(Function));
    });
    it("should emit the 'NewMonitorEvent'", function() {
      expect(scope.$emit).toHaveBeenCalledWith("NewMonitorEvent", "test.monitor");
    });
    it("should close the dialog", function() {
      expect($stub.modal).toHaveBeenCalledWith("hide");
    });
  });
});

