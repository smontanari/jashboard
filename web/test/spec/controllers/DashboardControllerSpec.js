describe("DashboardController", function() {
  var scope = {};
  var httpService = {};
  var controller;
  var ajaxCallback = function(content) {
    return {success: function(callBack) { callBack(content); }}
  };

  beforeEach(function() {
    scope.$apply = jasmine.createSpy();
    spyOn(jashboard.model, "Monitor").andCallFake(function(data) {
    this.monitorName = data.name;
    });
  });

  describe("Dashboards data retrieval", function() {
    var dashboards_data = [{id: "test.id.1", name: "test.dashboard.1"}, {id: "test.id.2", name: "test.dashboard.2"}];
    beforeEach(function() {
      httpService.getJSON = jasmine.createSpy("httpService").andReturn(ajaxCallback(dashboards_data));
      controller = new jashboard.DashboardController(scope, httpService);
    });

    it("should invoke the http service to load the dashboard data", function() {
      expect(httpService.getJSON).toHaveBeenCalledWith("/ajax/dashboards");
    });
    it("should populate the model with data returned from the http service", function() {
      expect(scope.dashboards).toEqual([{id: "test.id.1", name: "test.dashboard.1", monitors: []}, {id: "test.id.2", name: "test.dashboard.2", monitors: []}]);
    });
  });

  describe("Monitors data retrieval", function() {
    var dashboards_data = [{id:"id1", monitor_ids: ["test.monitor.1", "test.monitor.2"]}, {id:"id2", monitor_ids: ["test.monitor.3"]}];
    beforeEach(function() {
      httpService.getJSON = jasmine.createSpy("httpService").andCallFake(function(url) {
        var regexp = /\/ajax\/monitor\/(test\.monitor\.\d)/;
        if (url === "/ajax/dashboards") return ajaxCallback(dashboards_data);
        else if (regexp.test(url)) {
          var monitor_id = regexp.exec(url)[1];
          return ajaxCallback({id: monitor_id, name: monitor_id + "_name"});
        }
      });
      controller = new jashboard.DashboardController(scope, httpService);
    });

    it("should invoke the http service to load monitor data", function() {
      expect(httpService.getJSON).toHaveBeenCalledWith("/ajax/monitor/test.monitor.1");
      expect(httpService.getJSON).toHaveBeenCalledWith("/ajax/monitor/test.monitor.2");
      expect(httpService.getJSON).toHaveBeenCalledWith("/ajax/monitor/test.monitor.3");
    });
    it("should populate the model with data returned from the http service", function() {
      expect(scope.dashboards[0].monitors).toEqual([{monitorName: "test.monitor.1_name"}, {monitorName: "test.monitor.2_name"}]);
      expect(scope.dashboards[1].monitors).toEqual([{monitorName: "test.monitor.3_name"}]);
    });
  });

  describe("Dashboard menu actions", function() {
    it("should open the dialog form", function() {
      var $stub = testHelper.stubJQuery(["#new-monitor-form"]);
      $stub.dialog = jasmine.createSpy("$.dialog()");

      scope.actionNewMonitor();

      expect($stub.dialog).toHaveBeenCalledWith("open");
    });
  });
});
