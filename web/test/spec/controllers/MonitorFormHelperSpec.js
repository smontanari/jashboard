describe("MonitorFormHelper", function() {
  var formHelper, monitorForm, monitor, saveCallback;

  beforeEach(function() {
    monitorForm = {
      $dirty: false,
      isValid: false
    };

    monitor = {
      type: undefined
    };
    saveCallback = jasmine.createSpy();

    formHelper = new jashboard.MonitorFormHelper(monitorForm, monitor, saveCallback);
    formHelper.registerMonitorTypeForm("test_type", {});
    formHelper.registerMonitorTypeForm("another_type", {});
  });

  it("should have one initial action equal to 'next'", function() {
    expect(formHelper.actions).toEqual(["next"]);
  })
  it("should show the default monitor form", function() {
    expect(formHelper.showForm("defaultForm")).toEqual(true);
  });
  it("should not show the monitor form for any other type", function() {
    expect(formHelper.showForm("test_type")).toEqual(false);
    expect(formHelper.showForm("another_type")).toEqual(false);
  });

  describe("isActionEnabled()", function() {
    it("should return true on the 'back' action", function() {
      expect(formHelper.isActionEnabled("back")).toBeTruthy();
    });
    it("should use the default form for validation on the 'next' action", function() {
      expect(formHelper.isActionEnabled("next")).toBeFalsy();
    });
    it("should use the current monitor type form for validation on the 'save' action", function() {
      var form = {
        $dirty: true,
        isValid: true
      };
      monitor.type = "test_type";
      formHelper.registerMonitorTypeForm("test_type", form);
      formHelper.next();

      expect(formHelper.isActionEnabled("save")).toBeTruthy();
    });
  });

  describe("Action: next", function() {
    beforeEach(function() {
      monitor.type = "test_type";
      formHelper.next();
    });
    it("should show the form for monitor 'test_type'", function() {
      expect(formHelper.showForm("test_type")).toEqual(true);
    });
    it("should not show the form for any other type", function() {
      expect(formHelper.showForm("defaultForm")).toEqual(false);
      expect(formHelper.showForm("another_type")).toEqual(false);
    });
    it("should have two actions: 'back' and 'save'", function() {
      expect(formHelper.actions).toEqual(["back", "save"]);
    });
  });

  describe("Action: back", function() {
    beforeEach(function() {
      formHelper.back();
    });
    it("should show the default monitor form", function() {
      expect(formHelper.showForm("defaultForm")).toEqual(true);
    });
    it("should not show the monitor form for any other type", function() {
      expect(formHelper.showForm("test_type")).toEqual(false);
      expect(formHelper.showForm("another_type")).toEqual(false);
    });
    it("should have one initial action equal to 'Next'", function() {
      expect(formHelper.actions).toEqual(["next"]);
    });
  });

  describe("Action: save", function() {
    it("should invoke the callback", function() {
      formHelper.save();

      expect(saveCallback).toHaveBeenCalled();
    });
  });
});