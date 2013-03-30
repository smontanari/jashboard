describe("CreateMonitorWorkflow", function() {
  var workflow, monitorForm, monitor, saveCallback;

  beforeEach(function() {
    monitorForm = {
      $dirty: false,
      isValid: false
    };
    monitor = {
      type: undefined
    };
    saveCallback = jasmine.createSpy();
    workflow = new jashboard.CreateMonitorWorkflow(monitorForm, monitor, saveCallback);
  });

  it("should have one initial action equal to 'next'", function() {
    expect(workflow.actions).toEqual(["next"]);
  })
  it("should have the state equal to 'showBaseConfiguration'", function() {
    expect(workflow.state).toEqual("showBaseConfiguration");
  });

  describe("isActionEnabled()", function() {
    it("should return true if the 'back' action", function() {
      expect(workflow.isActionEnabled("back")).toBeTruthy();
    });
    it("should use the default form for validation", function() {
      expect(workflow.isActionEnabled("next")).toBeFalsy();
    });
    it("should use the current monitor type form for validation", function() {
      var form = {
        $dirty: true,
        isValid: true
      };
      monitor.type = "test_type";
      workflow.registerMonitorTypeForm("test_type", form);
      workflow.next();

      expect(workflow.isActionEnabled("save")).toBeTruthy();
    });
  });

  describe("Action: next", function() {
    beforeEach(function() {
      workflow.next();
    });
    it("should have the state equal to 'showSelectedConfiguration'", function() {
      expect(workflow.state).toEqual("showSelectedConfiguration");
    })
    it("should have two actions: 'back' and 'save'", function() {
      expect(workflow.actions).toEqual(["back", "save"]);
    });
  });

  describe("Action: back", function() {
    beforeEach(function() {
      workflow.back();
    });
    it("should have the state equal to 'showBaseConfiguration'", function() {
      expect(workflow.state).toEqual("showBaseConfiguration");
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