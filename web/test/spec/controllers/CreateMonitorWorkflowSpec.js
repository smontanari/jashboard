describe("CreateMonitorWorkflow", function() {
  var workflow, scope;
  var repository = {};

  beforeEach(function() {
    scope = {};
    workflow = new jashboard.CreateMonitorWorkflow(scope, repository);
  });

  it("should have one initial action equal to 'next'", function() {
    expect(workflow.actions).toEqual(["next"]);
  })
  it("should have the state equal to 'showGenericConfiguration'", function() {
    expect(workflow.state).toEqual("showGenericConfiguration");
  });

  describe("Action: next", function() {
    beforeEach(function() {
      workflow['next']();
    });
    it("should have the state equal to 'showSpecificConfiguration'", function() {
      expect(workflow.state).toEqual("showSpecificConfiguration");
    })
    it("should have two actions: 'back' and 'save'", function() {
      expect(workflow.actions).toEqual(["back", "save"]);
    })
  });

  describe("Action: back", function() {
    beforeEach(function() {
      workflow['next']();
      workflow['back']();
    });
    it("should have the state equal to 'showGenericConfiguration'", function() {
      expect(workflow.state).toEqual("showGenericConfiguration");
    })
    it("should have one initial action equal to 'Next'", function() {
      expect(workflow.actions).toEqual(["next"]);
    })
  });

  describe("Action: save", function() {
    beforeEach(function() {
      scope.$emit = jasmine.createSpy("scope.$emit");
      repository.createMonitor = jasmine.createSpy("repository.createMonitor").andCallFake(function(dashboard_id, monitorParameters, handler) {
        handler("test.monitor");
      });
      scope.monitorForm = {dashboard_id: "test_dashboard", name: "test.name"};
      workflow['save']();
    });

    it("should call the repository to create a monitor", function() {
      expect(repository.createMonitor).toHaveBeenCalledWith("test_dashboard", {name: "test.name"}, jasmine.any(Function));
    });
    it("should emit the 'NewMonitorCreated'", function() {
      expect(scope.$emit).toHaveBeenCalledWith("NewMonitorCreated", "test_dashboard", "test.monitor");
    });
  });
});