describe("MonitorFormHelper", function() {
  var formHelper, monitorForm, currentForm, monitorModel, saveCallback;

  beforeEach(function() {
    monitorForm = {};
    currentForm = {};

    monitorModel = {
      type: undefined
    };
    saveCallback = jasmine.createSpy();

    formHelper = new jashboard.MonitorFormHelper(monitorForm, monitorModel, saveCallback);
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
    it("should always enable the 'back' action", function() {
      expect(formHelper.isActionEnabled("back")).toBeTruthy();
    });
    it("should disable the 'next' action if the default form is not valid", function() {
      monitorForm.isValid = false;

      expect(formHelper.isActionEnabled("next")).toBeFalsy();
    });
    it("should enable the 'next' action if the default form is valid", function() {
      monitorForm.isValid = true;

      expect(formHelper.isActionEnabled("next")).toBeTruthy();
    });
    it("should enable the 'save' action if the current monitor type form is valid", function() {
      monitorModel.type = "test_type";
      formHelper.registerMonitorTypeForm("test_type", currentForm);
      currentForm.isValid = true;
      formHelper.next();

      expect(formHelper.isActionEnabled("save")).toBeTruthy();
    });
    it("should disable the 'save' action if the current monitor type form is not valid", function() {
      monitorModel.type = "test_type";
      formHelper.registerMonitorTypeForm("test_type", currentForm);
      currentForm.isValid = false;
      formHelper.next();

      expect(formHelper.isActionEnabled("save")).toBeFalsy();
    });
  });

  describe("Action: next", function() {
    beforeEach(function() {
      monitorModel.type = "test_type";
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

  describe("submitAction()", function() {
    it("should not execute the submit action if the form is not valid", function() {
      monitorForm.isValid = false;
      formHelper.submitAction();

      expect(formHelper.actions).toEqual(["next"]);
    });
    it("should execute the submit action 'next' if the form is valid", function() {
      monitorForm.isValid = true;
      formHelper.submitAction();

      expect(formHelper.actions).toEqual(["back", "save"]);
    });
    it("should not invoke the save callback if the form is not valid", function() {
      monitorModel.type = "test_type";
      formHelper.registerMonitorTypeForm("test_type", currentForm);
      currentForm.isValid = false;
      formHelper.next();
      formHelper.submitAction();

      expect(saveCallback).not.toHaveBeenCalled();
    });
    it("should invoke the save callback if the form is valid", function() {
      monitorModel.type = "test_type";
      formHelper.registerMonitorTypeForm("test_type", currentForm);
      currentForm.isValid = true;
      formHelper.next();
      formHelper.submitAction();

      expect(saveCallback).toHaveBeenCalled();
    });
  });
});