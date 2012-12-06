describe("jenkinsSettingsHandler", function() {
  xit("should register a build type handler", function() {
    jenkins.plugin.build.buildSettingsTypeAdapter = {
      registerTypeHandler: jasmine.createSpy("buildSettingsTypeAdapter.registerTypeHandler")
    };
    expect(jashboard.types.buildSettingsTypeAdapter.registerTypeHandler).toHaveBeenCalledWith('jenkins', mockHandler);
  });

  it("should capture the build settings for Jenkins", function() {
    var settings = jashboard.plugin.build.jenkinsSettingsHandler({type: 1, hostname: "test.host.name", port: 123, build_id: "test.build"});

    expect(settings.server).toEqual("Jenkins");
    expect(settings.hostname).toEqual("test.host.name");
    expect(settings.port).toEqual(123);
    expect(settings.build_id).toEqual("test.build");
  });
});