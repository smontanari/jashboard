describe("MonitorFormController", function() {
  var scope;
  var controller;
  var $stub;
  var repository = {};
  var dialogWidget = {};

  var resetScope = function() {
    scope = jasmine.createSpyObj("scope", ['$emit']);
  };

  beforeEach(function() {
    resetScope();
  });

  describe("saveMonitor", function() {
    beforeEach(function() {
      $stub = testHelper.stubJQuery(["#new-monitor-form", dialogWidget]);
      $stub.modal = jasmine.createSpy("$.modal()");
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

