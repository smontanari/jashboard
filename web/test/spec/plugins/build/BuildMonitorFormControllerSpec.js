describe("BuildMonitorFormController", function() {
  var scope = {};

  describe("Build configuration types", function() {
    beforeEach(function() {
      scope.$on = jasmine.createSpy("scope.$on");
      jashboard.plugin.build.buildConfigurationTypeAdapter = {
          getAllRegisteredTypes: jasmine.createSpy("buildConfigurationTypeAdapter.getAllRegisteredTypes").andReturn(["test_build_type1", "test_build_type2"])
      };
      controller = new jashboard.plugin.build.BuildMonitorFormController(scope);
    });

    it("should put in the scope the different settings types", function() {
      expect(scope.availableBuildSettingsTypes).toEqual(["test_build_type1", "test_build_type2"]);
    });
    it("should set the selected type in the scope", function() {
      scope.monitorForm = {
        configuration: {
          hostname: "test-host", 
          port: 123, 
          type:"test-type1",
          other: "test-other"
        }
      };

      controller = new jashboard.plugin.build.BuildMonitorFormController(scope);
      scope.setConfigurationType("test-type2");

      expect(scope.monitorForm.configuration.type).toEqual("test-type2");

    });
  });

  describe("'OpenMonitorDialog' event listener", function() {
    beforeEach(function() {
      scope.$on = jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
        handler({});
      });
      jashboard.plugin.build.buildConfigurationTypeAdapter = {
          getAllRegisteredTypes: jasmine.createSpy("buildConfigurationTypeAdapter.getAllRegisteredTypes")
            .andReturn(["test_build_type1", "test_build_type2"])
      };
      scope.monitorForm = {
        configuration: {
          hostname: "test-host", 
          port: 123, 
          type:"test-type",
          other: "test-other"
        }
      };
    });
    it("should listen to the 'OpenMonitorDialog' event", function() {
      controller = new jashboard.plugin.build.BuildMonitorFormController(scope);

      expect(scope.$on).toHaveBeenCalledWith("OpenMonitorDialog", jasmine.any(Function));
    });
    it("should reset the monitorForm.configuration variable in the scope", function() {
      controller = new jashboard.plugin.build.BuildMonitorFormController(scope);

      expect(scope.monitorForm.configuration).toEqual({type: "test_build_type1"});
    });
  });
});