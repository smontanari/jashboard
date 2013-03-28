describe("BuildMonitorFormController", function() {
  var scope, monitorRulesConstructor, listener;
  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ['$on']);

    monitorRulesConstructor = sinon.stub(jashboard, "BuildMonitorFormValidationRules");
    monitorRulesConstructor.withArgs(scope).returns({id: "buildMonitorRules"});
    
    jashboard.plugin.build.buildConfigurationParser = {
      getAllRegisteredTypes: jasmine.createSpy("buildConfigurationParser.getAllRegisteredTypes")
        .andReturn(["test_build_type1", "test_build_type2"])
    };
    scope.$on = jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
       listener = handler;
    });
    scope.monitorFormValidator = jasmine.createSpyObj("monitorFormValidator", ['addRules']);
    scope.inputMonitor = {
      configuration: {
        build: { type: "test-type1" }
      }
    };

    controller = new jashboard.plugin.build.BuildMonitorFormController(scope);
  });

  afterEach(function() {
    monitorRulesConstructor.restore();
  });

  it("should put in the scope the different settings types", function() {
    expect(scope.availableBuildSettingsTypes).toEqual(["test_build_type1", "test_build_type2"]);
  });
  it("should set the selected type in the scope", function() {
    scope.setConfigurationType("test-type2");

    expect(scope.inputMonitor.configuration.build.type).toEqual("test-type2");
  });
  it("should listen to the 'OpenMonitorDialog' event", function() {
    expect(scope.$on).toHaveBeenCalledWith("OpenMonitorDialog", jasmine.any(Function));
  });

  describe("'OpenMonitorDialog' event listener", function() {
    beforeEach(function() {
      scope.monitorForm = "monitorForm";
      listener({});
    });
    it("should reset the inputMonitor.configuration variable in the scope", function() {
      expect(scope.inputMonitor.configuration.build).toEqual({type: "test_build_type1"});
    });
  });
});