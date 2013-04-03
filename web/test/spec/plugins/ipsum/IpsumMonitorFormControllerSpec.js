describe("IpsumMonitorFormController", function() {
  var controller, scope, eventListener, rulesConstructor, formValidator;

  beforeEach(function() {
    scope = {
      $on: jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
        eventListener = handler;
      })
    };
    rulesConstructor = sinon.stub(jashboard, "IpsumMonitorFormValidationRules");
    rulesConstructor.withArgs(scope).returns({id: "ipsumMonitorRules"});
    formValidator = jasmine.createSpyObj("FormValidator", ['prepareFormForCreate', 'prepareFormForUpdate']);
    spyOn(jashboard, "FormValidator").andReturn(formValidator);

    controller = new jashboard.plugin.ipsum.IpsumMonitorFormController(scope);
  });
  afterEach(function() {
    rulesConstructor.restore();
  });

  it("should put in the scope the different languages", function() {
    expect(scope.availableLanguages).toEqual(["english", "french", "latin"]);
  });
  it("should set a FormValidator with the ipsum monitor form validation rules in the scope", function() {
    expect(scope.ipsumMonitorFormValidator).toEqual(formValidator);
  });
  it("should listen to the 'OpenMonitorDialog' event", function() {
    expect(scope.$on).toHaveBeenCalledWith("OpenMonitorDialog", jasmine.any(Function));
  });

  describe("'OpenMonitorDialog' event listener", function() {
    beforeEach(function() {
      scope.monitorConfigurationFormModel = {
        test_type: "test",
        ipsum: "test_ipsum"
      };
      scope.ipsumMonitorForm = "ipsumMonitorForm";
      scope.formHelper = jasmine.createSpyObj("formHelper", ['registerMonitorTypeForm']);
    });

    describe("create mode", function() {
      beforeEach(function() {
        eventListener({}, {
          mode: jashboard.inputOptions.createMode,
          parameters: {}
        });
      });
      it("should register the ipsumMonitorForm to the formHelper", function() {
        expect(scope.formHelper.registerMonitorTypeForm).toHaveBeenCalledWith("ipsum", "ipsumMonitorForm");
      });
      it("should reset the variables in the scope", function() {
        expect(scope.monitorConfigurationFormModel.ipsum).toEqual({language: "english"});
      });
      it("should init the form validator", function() {
        expect(scope.ipsumMonitorFormValidator.prepareFormForCreate).toHaveBeenCalledWith("ipsumMonitorForm", {id: "ipsumMonitorRules"});
      });
    });

    describe("update mode when monitor not of type 'ipsum'", function() {
      beforeEach(function() {
        eventListener({}, {
          mode: jashboard.inputOptions.updateMode,
          parameters: {monitor: {type: 'test_type', configuration: "test_configuration"}}
        });
      });
      it("should not init the form validator", function() {
        expect(scope.ipsumMonitorFormValidator.prepareFormForUpdate).not.toHaveBeenCalled();
      });
      it("should not update the monitorConfigurationFormModel", function() {
        expect(scope.monitorConfigurationFormModel.ipsum).toEqual("test_ipsum");
      });
    });
    
    describe("update mode when monitor of type 'ipsum'", function() {
      beforeEach(function() {
        eventListener({}, {
          mode: jashboard.inputOptions.updateMode,
          parameters: {monitor: {type: 'ipsum', configuration: "test_configuration"}}
        });
      });
      it("should init the form validator", function() {
        expect(scope.ipsumMonitorFormValidator.prepareFormForUpdate).toHaveBeenCalledWith("ipsumMonitorForm", {id: "ipsumMonitorRules"});
      });
      it("should update the monitorConfigurationFormModel according to the current monitor configuration", function() {
        expect(scope.monitorConfigurationFormModel.ipsum).toEqual("test_configuration");
      });
      it("should register the ipsumMonitorForm to the formHelper", function() {
        expect(scope.formHelper.registerMonitorTypeForm).toHaveBeenCalledWith("ipsum", "ipsumMonitorForm");
      });
    });
  });
});