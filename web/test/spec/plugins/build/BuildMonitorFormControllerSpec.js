describe("BuildMonitorFormController", function() {
  var scope, listener;
  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ['$on']);

    jashboard.plugin.build.buildTypes = ["test_build_type1", "test_build_type2"];
    scope.$on = jasmine.createSpy("scope.$on").and.callFake(function(eventName, handler) {
       listener = handler;
    });

    controller = new jashboard.plugin.build.BuildMonitorFormController(scope);
  });

  it("should put in the scope the different settings types", function() {
    expect(scope.availableCiServerTypes).toEqual(["test_build_type1", "test_build_type2"]);
  });
  it("should listen to the 'OpenMonitorDialog' event", function() {
    expect(scope.$on).toHaveBeenCalledWith("OpenMonitorDialog", jasmine.any(Function));
  });

  describe("scope.setCiServerType()", function() {
    beforeEach(function() {
      scope.$formValidator = jasmine.createSpyObj("$formValidator", ['validate']);
      scope.monitorConfigurationFormModel = {
        build: {type: "test some type"}
      };

      scope.setCiServerType("test_type");
    });
    it("should set the coniguration build.type", function() {
      expect(scope.monitorConfigurationFormModel.build.type).toEqual("test_type");
    });
    it("should trigger input validation", function() {
      expect(scope.$formValidator.validate).toHaveBeenCalled();
    });
  });

  describe("'OpenMonitorDialog' event listener", function() {
    beforeEach(function() {
      scope.formHelper = jasmine.createSpyObj("formHelper", ['registerMonitorTypeForm']);
      scope.buildMonitorForm = "buildMonitorForm";
      scope.monitorConfigurationFormModel = {};
    });

    it("should register the buildMonitorForm to the formHelper", function() {
      listener({}, {});
      expect(scope.formHelper.registerMonitorTypeForm).toHaveBeenCalledWith("build", "buildMonitorForm");
    });
    it("should reset the configuration value in the scope when called in create mode", function() {
      listener({}, {
        mode: jashboard.model.inputOptions.createMode,
      });
      expect(scope.monitorConfigurationFormModel.build).toEqual({type: "test_build_type1"});
    });
  });
});