describe("Repository", function() {
  var httpService, repository, successHandler, errorHandler, modelMapper;

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
    modelMapper = jasmine.createSpyObj("ModelMapper", ['mapDashboard', 'mapMonitor', 'mapMonitorRuntimeInfo']);
    repository = new jashboard.Repository(httpService, modelMapper);
    successHandler = jasmine.createSpy("successHandler callback");
    errorHandler = jasmine.createSpy("errorHandler callback");
  });

  describe("Loading dashboards data", function() {
    beforeEach(function() {
      httpService.getJSON = jasmine.createSpy("httpService.getJSON()")
        .andReturn(new AjaxPromise(["test_dashboard1", "test_dashboard2"])
      );      
    });
    it("should invoke the http service to load and return the dashboards information", function() {
      modelMapper.mapDashboard = jasmine.createSpy("modelMapper.mapDashboard()").andCallFake(function(data) {
        return {id: data};
      });

      repository.loadDashboards({success: successHandler});

      expect(httpService.getJSON).toHaveBeenCalledWith("/ajax/dashboards");
      expect(successHandler).toHaveBeenCalledWith([
        {id: "test_dashboard1"},
        {id: "test_dashboard2"},
      ]);
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
    });
    it("should invoke the http service to load and return the monitor runtime information", function() {
      modelMapper.mapMonitorRuntimeInfo = jasmine.createSpy("modelMapper.mapMonitorRuntimeInfo()")
        .andCallFake(function(type, data) {
          return {runtimeInfo: data};
        }
      );

      repository.loadMonitorRuntimeInfo("test.monitor.id", "test_type", {success: successHandler});

      expect(httpService.getJSON).toHaveBeenCalledWith("/ajax/monitor/test.monitor.id/runtime");
      expect(modelMapper.mapMonitorRuntimeInfo).toHaveBeenCalledWith("test_type", "test_monitor_data");
      expect(successHandler).toHaveBeenCalledWith({runtimeInfo: "test_monitor_data"});
    });
    it("should invoke the error handler if the request fails", function() {
      repository.loadMonitorRuntimeInfo("test.monitor.id", "test_type", {error: errorHandler});

      expect(errorHandler).toHaveBeenCalledWith("test_status", "test_message", "test_error");
    });
  });

  describe("Creating a dashboard", function() {
    beforeEach(function() {
      httpService.postJSON = jasmine.createSpy("httpService.postJSON()").andReturn(
        new AjaxPromise("test_dashboard")
      );      
    });
    it("should use the http service to save the dashboard data and invoke the callback", function() {
      modelMapper.mapDashboard = jasmine.createSpy("modelMapper.mapDashboard()").andCallFake(function(data) {
        return {id: data};
      });

      repository.createDashboard({name: "test.dashboard"}, {success: successHandler});

      expect(httpService.postJSON).toHaveBeenCalledWith("/ajax/dashboard", {name: "test.dashboard"});
      expect(successHandler).toHaveBeenCalledWith({id: "test_dashboard"});
    });
    it("should invoke the error handler if the request fails", function() {
      repository.createDashboard("test", {error: errorHandler});

      expect(errorHandler).toHaveBeenCalledWith("test_status", "test_message", "test_error");
    });    
  });

  describe("Creating a monitor", function() {
    beforeEach(function() {
      httpService.postJSON = jasmine.createSpy("httpService.postJSON()").andReturn(
        new AjaxPromise("test_monitor")
      );      
    });
    it("should use the http service to save the monitor data and invoke the callback", function() {
      modelMapper.mapMonitor = jasmine.createSpy("modelMapper.mapMonitor()").andCallFake(function(data) {
        return {id: data};
      });

      repository.createMonitor("test_dashboard", {name: "test.monitor"}, {success: successHandler});

      expect(httpService.postJSON).toHaveBeenCalledWith("/ajax/dashboard/test_dashboard/monitor", {name: "test.monitor"});
      expect(successHandler).toHaveBeenCalledWith({id: "test_monitor"});
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
  });

  describe("Deleting a monitor", function() {
    beforeEach(function() {
      httpService.delete = jasmine.createSpy("httpService.delete()").andReturn(
        new AjaxPromise("")
      );      
    });
    it("should use the http service to delete the monitor", function() {
      repository.deleteMonitor("test_id", {success: successHandler});

      expect(httpService.delete).toHaveBeenCalledWith("/ajax/monitor/test_id");
      expect(successHandler).toHaveBeenCalled();
    });    
    it("should invoke the error handler if the request fails", function() {
      repository.deleteMonitor("test_id", {error: errorHandler});

      expect(errorHandler).toHaveBeenCalledWith("test_status", "test_message", "test_error");
    });    
  });
});
