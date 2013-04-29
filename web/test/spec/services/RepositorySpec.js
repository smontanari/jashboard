describe("Repository", function() {
  var httpService, repository, successHandler, errorHandler, pluginManager;

  var AjaxPromise = function(successfulResponse) {
    this.done = function(callBack) { 
      callBack(successfulResponse);
      return this;
    };
    this.fail = function(callback) { 
      callback({responseText: "test_error"}, "test_status", "test_message"); 
      return this;
    };
  };

  beforeEach(function() {
    httpService = jasmine.createSpyObj("httpService", ['getJSON', 'postJSON', 'putJSON']);
    pluginManager = {};

    repository = new jashboard.Repository(httpService, pluginManager);
    successHandler = jasmine.createSpy("successHandler callback");
    errorHandler = jasmine.createSpy("errorHandler callback");
  });

  describe("Loading dashboards data", function() {
    beforeEach(function() {
      var data = [
        {id: "test_dashboard1", name:"dashboard1", monitors: [
          {id: "test_monitor1", name: "monitor1", type: "type1"}, {id: "test_monitor2", name: "monitor2", type: "type2"}
        ]},
        {id: "test_dashboard2", name: "dashboard2", monitors: []}
      ];
      httpService.getJSON = jasmine.createSpy("httpService.getJSON()")
        .andReturn(new AjaxPromise(data)
      );
      dashboardFn = spyOn(jashboard.model, "Dashboard").andCallThrough();
      monitorFn = spyOn(jashboard.model, "Monitor").andCallThrough();
    });
    it("should invoke the http service to load and return the dashboards information", function() {
      repository.loadDashboards({success: successHandler});

      expect(httpService.getJSON).toHaveBeenCalledWith("/ajax/dashboards");

      expect(successHandler).toHaveBeenCalled();
    });
    it("should invoke the error handler if the request fails", function() {
      repository.loadDashboards({error: errorHandler});

      expect(errorHandler).toHaveBeenCalledWith("test_status", "test_message", "test_error");
    });
  });

  describe("Loading monitor runtime data", function() {
    beforeEach(function() {
      httpService.getJSON = jasmine.createSpy("httpService.getJSON")
        .andReturn(new AjaxPromise("test_monitor_data")
      );
      pluginManager.monitorAdapters = {
        'test_type': {
          convertDataToRuntimeInfo: function(runtimeData) {
            return {runtimeInfo: runtimeData};
          }
        }
      };
    });
    it("should invoke the http service to load and return the monitor runtime information", function() {
      repository.loadMonitorRuntimeInfo("test.monitor.id", "test_type", {success: successHandler});

      expect(httpService.getJSON).toHaveBeenCalledWith("/ajax/monitor/test.monitor.id/runtime");
      expect(successHandler).toHaveBeenCalledWith({runtimeInfo: "test_monitor_data"});
    });
    it("should invoke the error handler if the request fails", function() {
      repository.loadMonitorRuntimeInfo("test.monitor.id", "test_type", {error: errorHandler});

      expect(errorHandler).toHaveBeenCalledWith("test_status", "test_message", "test_error");
    });
  });

  describe("createDashboard()", function() {
    var dashboardFn;
    beforeEach(function() {
      httpService.postJSON = jasmine.createSpy("httpService.postJSON()").andReturn(
        new AjaxPromise("test_dashboard_response")
      );
      dashboardFn = spyOn(jashboard.model, "Dashboard").andReturn({name: "test_dashboard"});
    });
    it("should use the http service to save the dashboard data and invoke the success handler", function() {
      repository.createDashboard("test.dashboard.request", {success: successHandler});

      expect(httpService.postJSON).toHaveBeenCalledWith("/ajax/dashboard", "test.dashboard.request");
      expect(dashboardFn).toHaveBeenCalledWith("test_dashboard_response");
      expect(successHandler).toHaveBeenCalledWith({name: "test_dashboard"});
    });
    it("should invoke the error handler if the request fails", function() {
      repository.createDashboard("test", {error: errorHandler});

      expect(errorHandler).toHaveBeenCalledWith("test_status", "test_message", "test_error");
    });
  });

  describe("updateDashboard()", function() {
    beforeEach(function() {
      httpService.putJSON = jasmine.createSpy("httpService.putJSON()").andReturn(
        new AjaxPromise("")
      );
    });
    it("should use the http service to save the dashboard data and invoke the success handler", function() {
      repository.updateDashboard({id:"test_dashboard_id", name: "test.dashboard"}, {success: successHandler});

      expect(httpService.putJSON).toHaveBeenCalledWith("/ajax/dashboard/test_dashboard_id", {name: "test.dashboard"});
      expect(successHandler).toHaveBeenCalledWith("");
    });
    it("should invoke the error handler if the request fails", function() {
      repository.updateDashboard("test", {error: errorHandler});

      expect(errorHandler).toHaveBeenCalledWith("test_status", "test_message", "test_error");
    });
  });

  describe("createMonitor()", function() {
    var monitorFn;
    beforeEach(function() {
      httpService.postJSON = jasmine.createSpy("httpService.postJSON()").andReturn(
        new AjaxPromise("create_monitor_response")
      );
      monitorFn = spyOn(jashboard.model, "Monitor").andReturn({name: "test_monitor"});
    });
    it("should use the http service to save the monitor data and invoke the callback", function() {
      repository.createMonitor("test_dashboard", "test.monitor", {success: successHandler});

      expect(httpService.postJSON).toHaveBeenCalledWith("/ajax/dashboard/test_dashboard/monitor", "test.monitor");
      expect(monitorFn).toHaveBeenCalledWith("create_monitor_response");
      expect(successHandler).toHaveBeenCalledWith({name: "test_monitor"});
    });
    it("should invoke the error handler if the request fails", function() {
      repository.createMonitor("test", "test", {error: errorHandler});

      expect(errorHandler).toHaveBeenCalledWith("test_status", "test_message", "test_error");
    });
  });
  
  describe("Updating a monitor", function() {
    it("should use the http service to update the monitor position", function() {
      repository.updateMonitorPosition("test_id", "test.position");

      expect(httpService.putJSON).toHaveBeenCalledWith("/ajax/monitor/test_id/position", "test.position");
    });
    it("should use the http service to update the monitor size", function() {
      repository.updateMonitorSize("test_id", "test.size");

      expect(httpService.putJSON).toHaveBeenCalledWith("/ajax/monitor/test_id/size", "test.size");
    });

    describe("Updating monitor configuration", function() {
      beforeEach(function() {
        httpService.putJSON = jasmine.createSpy("httpService.putJSON()").andReturn(
          new AjaxPromise("")
        );
        var monitor = {
          id: "test_id",
          name: "test_name",
          type: "test_type",
          refreshInterval: 123,
          size: "test_size",
          position: "test_position",
          configuration: "test.configuration"
        };
        repository.updateMonitorConfiguration(monitor, {success: successHandler, error: errorHandler});
      });
      it("should use the http service to update the monitor configuration", function() {
        expect(httpService.putJSON).toHaveBeenCalledWith("/ajax/monitor/test_id/configuration", {
          name: "test_name",
          refreshInterval: 123,
          type: "test_type",
          configuration: "test.configuration"
        });
      });
      it("should invoke the ajax callback handlers", function() {
        expect(successHandler).toHaveBeenCalled();
        expect(errorHandler).toHaveBeenCalledWith("test_status", "test_message", "test_error");
      });
    });
  });

  describe("Removing a dashboard and all its monitors", function() {
    beforeEach(function() {
      httpService.deleteResource = jasmine.createSpy("httpService.deleteResource()").andReturn(
        new AjaxPromise("")
      );
    });
    it("should use the http service to delete the monitor", function() {
      repository.deleteDashboard("test_dashboard", {success: successHandler});

      expect(httpService.deleteResource).toHaveBeenCalledWith("/ajax/dashboard/test_dashboard");
      expect(successHandler).toHaveBeenCalled();
    });
    it("should invoke the error handler if the request fails", function() {
      repository.deleteDashboard("test_dashboard", {error: errorHandler});

      expect(errorHandler).toHaveBeenCalledWith("test_status", "test_message", "test_error");
    });
  });

  describe("Removing a monitor from a dashboard", function() {
    beforeEach(function() {
      httpService.deleteResource = jasmine.createSpy("httpService.deleteResource()").andReturn(
        new AjaxPromise("")
      );
    });
    it("should use the http service to delete the monitor", function() {
      repository.deleteMonitor("test_dashboard", "test_id", {success: successHandler});

      expect(httpService.deleteResource).toHaveBeenCalledWith("/ajax/dashboard/test_dashboard/monitor/test_id");
      expect(successHandler).toHaveBeenCalled();
    });
    it("should invoke the error handler if the request fails", function() {
      repository.deleteMonitor("test_dashboard", "test_id", {error: errorHandler});

      expect(errorHandler).toHaveBeenCalledWith("test_status", "test_message", "test_error");
    });
  });
});
