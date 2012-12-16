describe("Repository", function() {
  var httpService = {};
  var monitorAdapter = {};
  var pluginManager = {};
  var repository, handler;

  var ajaxCallback = function(content) {
    return {success: function(callBack) { callBack(content); }}
  };

  beforeEach(function() {
    repository = new jashboard.Repository(httpService, pluginManager);
    handler = jasmine.createSpy("handler callback");
    pluginManager.findMonitorAdapter = jasmine.createSpy("pluginManager.findMonitorAdapter()").andReturn(monitorAdapter);
    monitorAdapter.parseConfiguration = jasmine.createSpy("monitorAdapter.parseConfiguration()").andCallFake(function(data) {
      return {test_configuration: data};
    });
    spyOn(jashboard.model, "Dashboard").andCallFake(function(data) {
      this.id = data.id;
      this.monitors = [];
    });
    spyOn(jashboard.model, "Monitor").andCallFake(function(data) {
      this.type = data.type;
      this.configuration = {};
    });
  });

  describe("Loading data", function() {
    it("should invoke the http service to load and return the dashboards information", function() {
      httpService.getJSON = jasmine.createSpy("httpService.getJSON()").andReturn(ajaxCallback(
        [
          {id: "test.dashboard.1", monitors: [
            {type: "monitor_type1", configuration: "test_configuration1"},
            {type: "monitor_type2", configuration: "test_configuration2"}
          ]},
          {id: "test.dashboard.2", monitors: []}
        ]
      ));

      repository.loadDashboards(handler);

      expect(httpService.getJSON).toHaveBeenCalledWith("/ajax/dashboards");
      expect(pluginManager.findMonitorAdapter).toHaveBeenCalledWith("monitor_type1");
      expect(pluginManager.findMonitorAdapter).toHaveBeenCalledWith("monitor_type2");
      expect(monitorAdapter.parseConfiguration).toHaveBeenCalledWith("test_configuration1");
      expect(monitorAdapter.parseConfiguration).toHaveBeenCalledWith("test_configuration2");
      expect(handler).toHaveBeenCalledWith([
        {id: "test.dashboard.1", monitors: [
          {type: "monitor_type1", configuration: {test_configuration: "test_configuration1"}},
          {type: "monitor_type2", configuration: {test_configuration: "test_configuration2"}}
        ]},
        {id: "test.dashboard.2", monitors: []}
      ]);
    });
    it("should invoke the http service to load and return the monitor runtime information", function() {
      pluginManager.findMonitorAdapter = jasmine.createSpy("pluginManager.findMonitorAdapter()").andReturn(monitorAdapter);
      monitorAdapter.parseRuntimeInfo = jasmine.createSpy("monitorAdapter.parseRuntimeInfo()").andCallFake(function(data) {
        return {test_runtime: data};
      });
      httpService.getJSON = jasmine.createSpy("httpService.getJSON").andReturn(ajaxCallback("test.monitor.data"));

      repository.loadMonitorRuntimeInfo("test.monitor.id", "test_type", handler);

      expect(httpService.getJSON).toHaveBeenCalledWith("/ajax/monitor/test.monitor.id/runtime");
      expect(pluginManager.findMonitorAdapter).toHaveBeenCalledWith("test_type");
      expect(handler).toHaveBeenCalledWith({test_runtime: "test.monitor.data"});
    });
  });

  describe("Saving data", function() {
    it("should use the http service to save the dashboard data and invoke the callback", function() {
      httpService.postJSON = jasmine.createSpy("httpService.postJSON()").andReturn(ajaxCallback(
        {id: "test.dashboard.1", monitors: [
          {type: "monitor_type1", configuration: "test_configuration1"}
        ]}
      ));

      repository.createDashboard({name: "test.dashboard"}, handler);

      expect(pluginManager.findMonitorAdapter).toHaveBeenCalledWith("monitor_type1");
      expect(monitorAdapter.parseConfiguration).toHaveBeenCalledWith("test_configuration1");

      expect(httpService.postJSON).toHaveBeenCalledWith("/ajax/dashboard", {name: "test.dashboard"});
      expect(handler).toHaveBeenCalledWith({id: "test.dashboard.1", monitors: [
          {type: "monitor_type1", configuration: {test_configuration: "test_configuration1"}}]});
    });

    it("should use the http service to save the monitor data and invoke the callback", function() {
      httpService.postJSON = jasmine.createSpy("httpService.postJSON()").andReturn(ajaxCallback(
        {
          id: "monitor_1",
          type: "monitor_type1",
          configuration: "test_configuration1"
        }
      ));

      repository.createMonitor({name: "test.monitor"}, handler);

      expect(pluginManager.findMonitorAdapter).toHaveBeenCalledWith("monitor_type1");
      expect(monitorAdapter.parseConfiguration).toHaveBeenCalledWith("test_configuration1");
      expect(httpService.postJSON).toHaveBeenCalledWith("/ajax/monitor", {name: "test.monitor"});
      expect(handler).toHaveBeenCalledWith({type: "monitor_type1", configuration: {test_configuration: "test_configuration1"}});
    });
  });
});
