describe("MainController", function() {
  var scope;
  var httpService = {};
  var controller;
  var ajaxCallback = function(content) {
    return {success: function(callBack) { callBack(content); }}
  };
  var resetScope = function() {
    scope = {};
    scope.$apply = jasmine.createSpy();
  };

  beforeEach(function() {
    resetScope();
    spyOn(jashboard.model, "Monitor").andCallFake(function(data) {
      this.monitorName = data.name;
    });
  });

  describe("Dashboards data retrieval", function() {
    beforeEach(function() {
      httpService.getJSON = jasmine.createSpy("httpService").andReturn(ajaxCallback(
        [
          {id: "test.id.1", name: "test.dashboard.1"}, {id: "test.id.2", name: "test.dashboard.2"}
        ]
      ));
      controller = new jashboard.MainController(scope, httpService);
    });

    it("should invoke the http service to load the dashboard data", function() {
      expect(httpService.getJSON).toHaveBeenCalledWith("/ajax/dashboards");
    });
    it("should populate the model with data returned from the http service", function() {
      expect(scope.dashboards).toEqual([{id: "test.id.1", name: "test.dashboard.1", monitors: []}, {id: "test.id.2", name: "test.dashboard.2", monitors: []}]);
    });
  });

  describe("Monitors data retrieval", function() {
    beforeEach(function() {
      httpService.getJSON = jasmine.createSpy("httpService").andCallFake(function(url) {
        var regexp = /\/ajax\/monitor\/(test\.monitor\.\d)/;
        if (url === "/ajax/dashboards") return ajaxCallback(
          [
            {id:"id1", monitor_ids: ["test.monitor.1", "test.monitor.2"]}, {id:"id2", monitor_ids: ["test.monitor.3"]}
          ]);
        else if (regexp.test(url)) {
          var monitor_id = regexp.exec(url)[1];
          return ajaxCallback({id: monitor_id, name: monitor_id + "_name"});
        }
      });
      controller = new jashboard.MainController(scope, httpService);
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
});
