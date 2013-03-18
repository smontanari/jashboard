describe("CreateMonitorWorkflow", function() {
  var workflow, saveCallback;

  beforeEach(function() {
    saveCallback = jasmine.createSpy();
    workflow = new jashboard.CreateMonitorWorkflow(saveCallback);
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
    it("should have the state equal to 'showSelectedConfiguration'", function() {
      expect(workflow.state).toEqual("showSelectedConfiguration");
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
    it("should invoke the callback", function() {
      workflow.save();

      expect(saveCallback).toHaveBeenCalled();
    });
  });
});