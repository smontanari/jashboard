describe("BuildMonitorFormController", function() {
  var scope = {};

  describe("Build settings types", function() {
    beforeEach(function() {
      jashboard.plugin.build.buildConfigurationTypeAdapter = {
          getAllRegisteredTypes: jasmine.createSpy("buildConfigurationTypeAdapter.getAllRegisteredTypes").andReturn(["test_build_type1", "test_build_type2"])
      };
      controller = new jashboard.plugins.build.BuildMonitorFormController(scope);
    });

    it("should put in the scope the different settings types", function() {
      expect(scope.availableBuildSettingsTypes).toEqual(["test_build_type1", "test_build_type2"]);
    });
  });
});