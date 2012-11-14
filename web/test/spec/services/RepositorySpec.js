describe("Repository", function() {
  var httpService = {};
  var repository;
  var handler;
  var ajaxCallback = function(content) {
    return {success: function(callBack) { callBack(content); }}
  };

  beforeEach(function() {
    repository = new jashboard.Repository(httpService);
    handler = jasmine.createSpy("handler callback");
  });

  describe("Loading data", function() {
    it("should invoke the http service to load and return the dashboard data", function() {
      spyOn(jashboard.model, "Dashboard").andCallFake(function(data) {
        this.data = data;
      });
      httpService.getJSON = jasmine.createSpy("httpService.getJSON").andReturn(ajaxCallback(
        [
          "test.dashboard.1", "test.dashboard.2"
        ]
      ));

      repository.loadDashboards(handler);

      expect(httpService.getJSON).toHaveBeenCalledWith("/ajax/dashboards");
      expect(handler).toHaveBeenCalledWith([{data: "test.dashboard.1"}, {data: "test.dashboard.2"}]);
    });
    it("should invoke the http service to load and return the monitor runtime data", function() {
      spyOn(jashboard.model, "MonitorBuildRuntime").andCallFake(function(data) {
        this.data = data;
      });
      httpService.getJSON = jasmine.createSpy("httpService.getJSON").andReturn(ajaxCallback("test.monitor.data"));

      repository.loadMonitorRuntime("test.monitor.id", handler);

      expect(httpService.getJSON).toHaveBeenCalledWith("/ajax/monitor/test.monitor.id/runtime");
      expect(handler).toHaveBeenCalledWith({data: "test.monitor.data"});
    });
  });

  describe("Saving data", function() {
    beforeEach(function() {
      httpService.postJSON = jasmine.createSpy("httpService.postJSON").andReturn(ajaxCallback("test.return.data"));
      spyOn(jashboard.model, "Dashboard").andCallFake(function(data) {
        this.data = data;
      });
    });

    it("should invoke the http service to save and return the dashboard data", function() {
      repository.createDashboard({name: "test.dashboard"}, handler);
      expect(httpService.postJSON).toHaveBeenCalledWith("/ajax/dashboard", {name: "test.dashboard"});
      expect(handler).toHaveBeenCalledWith({data: "test.return.data"});
    });
  });
});
