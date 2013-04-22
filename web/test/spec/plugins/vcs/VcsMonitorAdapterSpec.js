describe("VcsMonitorAdapter", function() {
  var plugin, configData, configForm, configModel;

  beforeEach(function() {
    plugin = new jashboard.plugin.vcs.VcsMonitorAdapter();
    configModel = {
      type: "test_type",
      workingDirectory: "test_directory",
      branch: "test_branch",
      historyLength: 123,
      pagination: true,
      commitsPerPage: 4
    };
    configForm = {
      type: "test_type",
      workingDirectory: "test_directory",
      branch: "test_branch",
      historyLength: "123",
      pagination: true,
      commitsPerPage: "4"
    };
  });

  it("should parse a configuration form", function() {
    var model = plugin.parseMonitorConfigurationForm(configForm);

    expect(model).toEqual(configModel);
  });

  it("should return a default size for the vcs monitor", function() {
    var size = plugin.defaultSize();

    expect(size).toEqual({width: 520, height: 170});
  });

  it("should convert the runtime vcs data", function() {
    var runtime_data = [{
      revisionId: "test_revision",
      date: "2013-04-15 23:59:48 +1000",
      author: "test_author",
      email: "test_email",
      message: "test_message"
    }];

    var runtimeInfo = plugin.convertDataToRuntimeInfo(runtime_data);

    expect(runtimeInfo).toEqual({commits: [
      {
        revisionId: "test_revision",
        date: "Mon Apr 15 23:59:48 2013 +1000",
        author: "test_author",
        email: "test_email",
        message: "test_message"
      }
    ]});
  });
});

