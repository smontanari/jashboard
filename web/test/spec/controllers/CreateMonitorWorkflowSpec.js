describe("CreateMonitorWorkflow", function() {
  var workflow, scope;
  var repository = {};

  beforeEach(function() {
    scope = {};
    workflow = new jashboard.CreateMonitorWorkflow(scope, repository);
  });

  it("should have one initial action equal to 'next'", function() {
    expect(scope.workflowActions).toEqual(["next"]);
  })
  it("should have the state equal to 'showGenericConfiguration'", function() {
    expect(scope.workflowState).toEqual("showGenericConfiguration");
  });

  describe("Action: next", function() {
    beforeEach(function() {
      workflow['next']();
    });
    it("should have the state equal to 'showSpecificConfiguration'", function() {
      expect(scope.workflowState).toEqual("showSpecificConfiguration");
    })
    it("should have two actions: 'back' and 'save'", function() {
      expect(scope.workflowActions).toEqual(["back", "save"]);
    })
  });

  describe("Action: back", function() {
    beforeEach(function() {
      workflow['next']();
      workflow['back']();
    });
    it("should have the state equal to 'showGenericConfiguration'", function() {
      expect(scope.workflowState).toEqual("showGenericConfiguration");
    })
    it("should have one initial action equal to 'Next'", function() {
      expect(scope.workflowActions).toEqual(["next"]);
    })
  });

  describe("Action: save", function() {
    beforeEach(function() {
      scope.$emit = jasmine.createSpy("scope.$emit");
      repository.createMonitor = jasmine.createSpy("repository.createMonitor").andCallFake(function(input, handler) {
        handler("test.monitor");
      });
      scope.monitorForm = {name: "test.name"};
      workflow['save']();
    });

    it("should call the repository to create a monitor", function() {
      expect(repository.createMonitor).toHaveBeenCalledWith({name: "test.name"}, jasmine.any(Function));
    });
    it("should emit the 'NewMonitorCreated'", function() {
      expect(scope.$emit).toHaveBeenCalledWith("NewMonitorCreated", "test.monitor");
    });
  });
});