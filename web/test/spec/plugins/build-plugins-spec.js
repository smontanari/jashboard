describe("Build plugins", function() {
  var mockHandler;
  var plugin;

  beforeEach(function() {
    jashboard.types.buildSettingsTypeManager = {};
    jashboard.types.buildSettingsTypeManager.registerTypeHandler = jasmine.createSpy("buildSettingsTypeManager.registerTypeHandler").andCallFake(function(id, handler) {
      mockHandler = handler;
    });
  });

  describe("JenkinsPlugin", function() {
    beforeEach(function() {
      new jashboard.plugin.JenkinsPlugin().initialize();
    });

    it("should register a build type handler", function() {
      expect(jashboard.types.buildSettingsTypeManager.registerTypeHandler).toHaveBeenCalledWith(1, mockHandler);
    });
    it("should capture the build settings for Jenkins", function() {
      var settings = mockHandler({type: 1, hostname: "test.host.name", port: 123, build_id: "test.build"});

      expect(settings.server).toEqual("Jenkins");
      expect(settings.hostname).toEqual("test.host.name");
      expect(settings.port).toEqual(123);
      expect(settings.build_id).toEqual("test.build");
    });
  });

  describe("GOPlugin", function() {
    beforeEach(function() {
      new jashboard.plugin.GOPlugin().initialize();
    });

    it("should register a build type handler", function() {
      expect(jashboard.types.buildSettingsTypeManager.registerTypeHandler).toHaveBeenCalledWith(2, mockHandler);
    });
    it("should capture the build settings for GO", function() {
      var settings = mockHandler({type: 2, hostname: "test.host.name", port: 123, pipeline: "test.pipeline", stage: "test.stage", job: "test.job"});

      expect(settings.server).toEqual("GO");
      expect(settings.hostname).toEqual("test.host.name");
      expect(settings.port).toEqual(123);
      expect(settings.pipeline).toEqual("test.pipeline");
      expect(settings.stage).toEqual("test.stage");
      expect(settings.job).toEqual("test.job");
    });
  });
});
