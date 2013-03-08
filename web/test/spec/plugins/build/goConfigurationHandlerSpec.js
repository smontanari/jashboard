describe("goConfigurationHandlers", function() {
  it("should parse the build configuration for GO", function() {
    var configuration = jashboard.plugin.build.goConfigurationParser(
      {
        type: "go",
        hostname: "test.host.name",
        port: 123,
        pipeline: "test.pipeline",
        stage: "test.stage",
        job: "test.job"
      }
    );

    expect(configuration.type).toEqual("go");
    expect(configuration.hostname).toEqual("test.host.name");
    expect(configuration.port).toEqual(123);
    expect(configuration.pipeline).toEqual("test.pipeline");
    expect(configuration.stage).toEqual("test.stage");
    expect(configuration.job).toEqual("test.job");
  });

  it("should validate the input configuration for GO", function() {
    var configuration = jashboard.plugin.build.goConfigurationValidator(
      {
        type: "go",
        hostname: "test.host.name",
        port: "123",
        pipeline: "test.pipeline",
        stage: "test.stage",
        job: "test.job"
      }
    );

    expect(configuration.type).toEqual("go");
    expect(configuration.hostname).toEqual("test.host.name");
    expect(configuration.port).toEqual(123);
    expect(configuration.pipeline).toEqual("test.pipeline");
    expect(configuration.stage).toEqual("test.stage");
    expect(configuration.job).toEqual("test.job");
  });
});
