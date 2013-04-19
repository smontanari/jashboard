describe("IpsumMonitorFormController", function() {
  var controller, scope, eventListener;

  beforeEach(function() {
    scope = {
      $on: jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
        eventListener = handler;
      })
    };

    controller = new jashboard.plugin.ipsum.IpsumMonitorFormController(scope);
  });

  it("should put in the scope the different languages", function() {
    expect(scope.availableLanguages).toEqual(["english", "french", "latin"]);
  });
  it("should listen to the 'OpenMonitorDialog' event", function() {
    expect(scope.$on).toHaveBeenCalledWith("OpenMonitorDialog", jasmine.any(Function));
  });

  describe("'OpenMonitorDialog' event listener", function() {
    beforeEach(function() {
      scope.monitorConfigurationFormModel = {};
      scope.ipsumMonitorForm = "ipsumMonitorForm";
      scope.formHelper = jasmine.createSpyObj("formHelper", ['registerMonitorTypeForm']);
    });

    it("should register the ipsumMonitorForm to the formHelper", function() {
      eventListener({}, {});

      expect(scope.formHelper.registerMonitorTypeForm).toHaveBeenCalledWith("ipsum", "ipsumMonitorForm");
    });
    it("should reset the variables in the scope", function() {
      eventListener({}, {
        mode: jashboard.inputOptions.createMode,
      });

      expect(scope.monitorConfigurationFormModel.ipsum).toEqual({
        language: "english",
        numberOfSentences: 1
      });
    });
  });
});