describe("goConfigurationHandler", function() {
  it("should capture the build configuration for GO", function() {
    var configuration = jashboard.plugin.build.goConfigurationHandler(
      {
        type: 2,
        hostname: "test.host.name",
        port: 123,
        pipeline: "test.pipeline",
        stage: "test.stage",
        job: "test.job"
      }
    );

    expect(configuration.server).toEqual("GO");
    expect(configuration.hostname).toEqual("test.host.name");
    expect(configuration.port).toEqual(123);
    expect(configuration.pipeline).toEqual("test.pipeline");
    expect(configuration.stage).toEqual("test.stage");
    expect(configuration.job).toEqual("test.job");
  });
});
