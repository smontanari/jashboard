describe("goConfigurationHandler", function() {
  it("should parse each form field", function() {
    var formModel = {
      type: "go",
      pipeline: "test-pipeline",
      stage: "test-stage",
      job: "test-job"
    };

    var config = jashboard.plugin.build.go.parseFormConfiguration(formModel);

    expect(config).toEqual(formModel);
  });
  it("should parse an empty job field to null", function() {
    var formModel = {
      type: "go",
      pipeline: "test-pipeline",
      stage: "test-stage",
      job: ""
    };

    var config = jashboard.plugin.build.go.parseFormConfiguration(formModel);

    expect(config).toEqual({
      type: "go",
      pipeline: "test-pipeline",
      stage: "test-stage",
      job: null
    });
  });
});