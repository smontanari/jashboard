describe("CreateMonitorWorkflow", function() {
  var workflow;

  beforeEach(function() {
    workflow = new jashboard.model.CreateMonitorWorkflow();
  });

  it("should have one initial action equal to 'next'", function() {
    expect(workflow.actions).toEqual(["next"]);
  })
  it("should have the state equal to 'showGenericConfiguration'", function() {
    expect(workflow.displayState).toEqual("showGenericConfiguration");
  })

  describe("Action: next", function() {
    beforeEach(function() {
      workflow['next']();
    });
    it("should have the state equal to 'showSpecificConfiguration'", function() {
      expect(workflow.displayState).toEqual("showSpecificConfiguration");
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
      expect(workflow.displayState).toEqual("showGenericConfiguration");
    })
    it("should have one initial action equal to 'Next'", function() {
      expect(workflow.actions).toEqual(["next"]);
    })
  });
});