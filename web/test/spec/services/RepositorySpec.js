describe("Repository", function() {
  var httpService, repository, handler, modelMapper;

  var ajaxCallback = function(content) {
    return {success: function(callBack) { callBack(content); }}
  };

  beforeEach(function() {
    httpService = jasmine.createSpyObj("ModelMapper", ['getJSON', 'postJSON']);
    modelMapper = jasmine.createSpyObj("ModelMapper", ['mapDashboard', 'mapMonitor']);
    repository = new jashboard.Repository(httpService, modelMapper);
    handler = jasmine.createSpy("handler callback");
  });

  describe("Loading data", function() {
    it("should invoke the http service to load and return the dashboards information", function() {
      httpService.getJSON = jasmine.createSpy("httpService.getJSON()").andReturn(ajaxCallback(
        ["test_dashboard1", "test_dashboard2"]
      ));
      modelMapper.mapDashboard = jasmine.createSpy("modelMapper.mapDashboard()").andCallFake(function(data) {
        return {id: data};
      });

      repository.loadDashboards(handler);

      expect(httpService.getJSON).toHaveBeenCalledWith("/ajax/dashboards");
      expect(handler).toHaveBeenCalledWith([
        {id: "test_dashboard1"},
        {id: "test_dashboard2"},
      ]);
    });
    it("should invoke the http service to load and return the monitor runtime information", function() {
      modelMapper.mapMonitorRuntimeInfo = jasmine.createSpy("modelMapper.mapMonitorRuntimeInfo()")
        .andCallFake(function(type, data) {
          return {runtimeInfo: data};
        }
      );

      httpService.getJSON = jasmine.createSpy("httpService.getJSON").andReturn(ajaxCallback("test_monitor_data"));

      repository.loadMonitorRuntimeInfo("test.monitor.id", "test_type", handler);

      expect(httpService.getJSON).toHaveBeenCalledWith("/ajax/monitor/test.monitor.id/runtime");
      expect(modelMapper.mapMonitorRuntimeInfo).toHaveBeenCalledWith("test_type", "test_monitor_data");
      expect(handler).toHaveBeenCalledWith({runtimeInfo: "test_monitor_data"});
    });
  });

  describe("Saving data", function() {
    it("should use the http service to save the dashboard data and invoke the callback", function() {
      httpService.postJSON = jasmine.createSpy("httpService.postJSON()").andReturn(
        ajaxCallback("test_dashboard")
      );
      modelMapper.mapDashboard = jasmine.createSpy("modelMapper.mapDashboard()").andCallFake(function(data) {
        return {id: data};
      });

      repository.createDashboard({name: "test.dashboard"}, handler);

      expect(httpService.postJSON).toHaveBeenCalledWith("/ajax/dashboard", {name: "test.dashboard"});
      expect(handler).toHaveBeenCalledWith({id: "test_dashboard"});
    });

    it("should use the http service to save the monitor data and invoke the callback", function() {
      httpService.postJSON = jasmine.createSpy("httpService.postJSON()").andReturn(
        ajaxCallback("test_monitor")
      );
      modelMapper.mapMonitor = jasmine.createSpy("modelMapper.mapMonitor()").andCallFake(function(data) {
        return {id: data};
      });

      repository.createMonitor("test_dashboard", {name: "test.monitor"}, handler);

      expect(httpService.postJSON).toHaveBeenCalledWith("/ajax/dashboard/test_dashboard/monitor", {name: "test.monitor"});
      expect(handler).toHaveBeenCalledWith({id: "test_monitor"});
    });
  });
});
