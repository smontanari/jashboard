describe("VcsMonitorAdapter", function() {
  var plugin, configData, configForm, configModel;

  beforeEach(function() {
    plugin = new jashboard.plugin.vcs.VcsMonitorAdapter();
    configData = {
      type: "test_type",
      working_directory: "test_directory",
      branch: "test_branch",
      history_length: 123
    };
    configModel = {
      type: "test_type",
      workingDirectory: "test_directory",
      branch: "test_branch",
      historyLength: 123
    };
    configForm = {
      type: "test_type",
      workingDirectory: "test_directory",
      branch: "test_branch",
      historyLength: "123"
    };
  });

  it("should convert the data to the configuration model", function() {
    var configuration = plugin.convertDataToMonitorConfiguration(configData);

    expect(configuration).toEqual(configModel);
  });

  it("should convert the configuration to data", function() {
    var data = plugin.convertMonitorConfigurationToData(configModel);

    expect(data).toEqual(configData);
  });

  it("should parse a configuration form", function() {
    var model = plugin.parseMonitorConfigurationForm(configForm);

    expect(model).toEqual(configModel);
  });

  it("should return a default size for the vcs monitor", function() {
    var size = plugin.defaultSize();

    expect(size).toEqual({width: 500, height: 150});
  });

  it("should convert the runtime vcs data", function() {
    var runtime_data = [{
      revision_id: "test_revision",
      date: "test_date",
      author: "test_author",
      email: "test_email",
      message: "test_message"
    }];

    var runtimeInfo = plugin.convertDataToRuntimeInfo(runtime_data);

    expect(runtimeInfo).toEqual({commits: runtime_data});
  });
});

