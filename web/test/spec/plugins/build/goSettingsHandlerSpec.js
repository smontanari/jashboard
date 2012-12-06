describe("goSettingsHandler", function() {
  it("should capture the build settings for GO", function() {
    var settings = jashboard.plugin.build.goSettingsHandler(
      {
        type: 2,
        hostname: "test.host.name",
        port: 123,
        pipeline: "test.pipeline",
        stage: "test.stage",
        job: "test.job"
      }
    );

    expect(settings.server).toEqual("GO");
    expect(settings.hostname).toEqual("test.host.name");
    expect(settings.port).toEqual(123);
    expect(settings.pipeline).toEqual("test.pipeline");
    expect(settings.stage).toEqual("test.stage");
    expect(settings.job).toEqual("test.job");
  });
});
