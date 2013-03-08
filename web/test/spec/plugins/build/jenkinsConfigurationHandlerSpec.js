describe("jenkinsConfigurationHandler", function() {
  it("should parse the build configuration for Jenkins", function() {
    var configuration = jashboard.plugin.build.jenkinsConfigurationParser({
      hostname: "test.host.name", port: 123, type: "jenkins", build_id: "test.build"
    });

    expect(configuration.type).toEqual("jenkins");
    expect(configuration.hostname).toEqual("test.host.name");
    expect(configuration.port).toEqual(123);
    expect(configuration.build_id).toEqual("test.build");
  });
  it("should validate the build configuration for Jenkins", function() {
    var configuration = jashboard.plugin.build.jenkinsConfigurationValidator({
      hostname: "test.host.name", port: "123", type: "jenkins", build_id: "test.build"
    });

    expect(configuration.type).toEqual("jenkins");
    expect(configuration.hostname).toEqual("test.host.name");
    expect(configuration.port).toEqual(123);
    expect(configuration.build_id).toEqual("test.build");
  });
});