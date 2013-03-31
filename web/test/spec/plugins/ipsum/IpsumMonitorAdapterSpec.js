describe("IpsumMonitorAdapter", function() {
  var adapter;

  beforeEach(function() {
    adapter = new jashboard.plugin.ipsum.IpsumMonitorAdapter();
  });

  it("should add itself to the plugin manager", function() {
    expect(jashboard.plugin.pluginManager.findMonitorAdapter('ipsum')).toBeDefined();
  });
  
  it("should parse the ipsum monitor configuration", function() {
    var configuration = adapter.parseConfiguration({no_sentences: 10, language: "english"});

    expect(configuration.numberOfSentences).toEqual(10);
    expect(configuration.language).toEqual("english");
  });

  it("should validate the form ipsum monitor configuration", function() {
    var configuration = adapter.getMonitorConfiguration({numberOfSentences: "10", language: "english"});

    expect(configuration.no_sentences).toEqual(10);
    expect(configuration.language).toEqual("english");
  });

  it("should parse the runtime information", function() {
    var runtimeInfo = adapter.parseRuntimeInfo({text: "some text"});

    expect(runtimeInfo).toEqual({text: "some text"});
  });

  it("should return a default size for the ipsum monitor", function() {
    var size = adapter.defaultSize();

    expect(size).toEqual({width: 250, height: 150});
  });
});

