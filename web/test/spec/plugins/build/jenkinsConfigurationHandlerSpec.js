describe("jenkinsConfigurationHandler", function() {
  xit("should register a build type handler", function() {
    jashboard.plugin.build.buildConfigurationTypeAdapter = {
      registerTypeHandler: jasmine.createSpy("buildConfigurationTypeAdapter.registerTypeHandler")
    };
    expect(jashboard.types.buildConfigurationTypeAdapter.registerTypeHandler).toHaveBeenCalledWith('jenkins', mockHandler);
  });

  it("should capture the build configuration for Jenkins", function() {
    var configuration = jashboard.plugin.build.jenkinsConfigurationHandler({hostname: "test.host.name", port: 123, build_id: "test.build"});

    expect(configuration.server).toEqual("Jenkins");
    expect(configuration.hostname).toEqual("test.host.name");
    expect(configuration.port).toEqual(123);
    expect(configuration.build_id).toEqual("test.build");
  });
});