describe("IpsumMonitorAdapter", function() {
  var adapter;

  beforeEach(function() {
    adapter = new jashboard.plugin.ipsum.IpsumMonitorAdapter();
  });

  it("should add itself to the plugin manager", function() {
    expect(jashboard.plugin.pluginManager.findMonitorAdapter('ipsum')).toBeDefined();
  });
  
  it("should parse the ipsum monitor configuration form", function() {
    var configuration = adapter.parseMonitorConfigurationForm({numberOfSentences: "10", language: "english"});

    expect(configuration.numberOfSentences).toEqual(10);
    expect(configuration.language).toEqual("english");
  });

  it("should convert data to the runtime information", function() {
    var runtimeInfo = adapter.convertDataToRuntimeInfo({text: "some text"});

    expect(runtimeInfo).toEqual({text: "some text"});
  });

  it("should return a default size for the ipsum monitor", function() {
    var size = adapter.defaultSize();

    expect(size).toEqual({width: 250, height: 150});
  });
});

