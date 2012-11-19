describe("MonitorFormController", function() {
  var scope;
  var controller;
  var $stub;
  var repository = {};

  beforeEach(function() {
    $stub = testHelper.stubJQuery(["#new-monitor-form"]);
    $stub.modal = jasmine.createSpy("$.modal()");
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
      scope.monitorForm = {name: "test.name"};

      scope.saveMonitor();
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

  describe("displayMonitorOptions", function() {
    beforeEach(function() {
      $stub = testHelper.stubJQuery(["#buildMonitorInput"]);
      $stub.collapse = jasmine.createSpy("$.collapse()");
      controller = new jashboard.MonitorFormController(scope, repository);
    });

    it("should toggle the build monitor options", function() {
      scope.monitorForm.type = 'build';
      scope.displayMonitorOptions();

      expect($stub.collapse).toHaveBeenCalledWith('toggle');
    });
  });
});

