describe("Monitor", function() {
  var monitor;

  describe("Initialisation", function() {
    beforeEach(function() {
      monitor = new jashboard.model.Monitor(
        {
          id: "test_id",
          name: "test_name",
          type: "test_type",
          refresh_interval: 123,
          configuration: {testConfiguration: "test"}
        });
    });
    
    it("should create a monitor with initial data", function() {
      expect(monitor.id).toEqual("test_id");
      expect(monitor.name).toEqual("test_name");
      expect(monitor.refreshInterval).toEqual(123);
      expect(monitor.type).toEqual("test_type");
    });
    it("should create a monitor with initial loading status as 'waiting'", function() {
      expect(monitor.loadingStatus).toEqual(jashboard.model.loadingStatus.waiting);
    });
    it("should create a monitor with empty configuration", function() {
      expect(monitor.configuration).toEqual({});
    });
    it("should create a monitor with empty runtime info", function() {
      expect(monitor.runtimeInfo).toEqual({});
    });
  });

  describe("setting the position", function() {
    var monitorData = {
      id: "test_id",
      name: "test_name",
      type: "test_type",
      refresh_interval: 123,
      configuration: {testConfiguration: "test"}
    };

    it("should create a monitor with undefined initial position", function() {
      var monitor = new jashboard.model.Monitor(monitorData);

      expect(monitor.position).toBeUndefined();
      expect(monitor.cssPosition).toBeUndefined();
    });
    it("should create a monitor with an absolute initial position", function() {
      monitorData.position = {top: 20, left: 50};
      var monitor = new jashboard.model.Monitor(monitorData);

      expect(monitor.position).toEqual({top: 20, left: 50});
      expect(monitor.cssPosition).toEqual({position: 'absolute', top: 20, left: 50});
    });

    it("should set an absolute position", function() {
      monitorData.position = {top: 20, left: 50};
      var monitor = new jashboard.model.Monitor(monitorData);
      monitor.setPosition({top: 45, left: 20});

      expect(monitor.position).toEqual({top: 45, left: 20});
      expect(monitor.cssPosition).toEqual({position: 'absolute', top: 45, left: 20});
    });
  });
  
  describe("Updating runtime info", function() {
    var callback, runtimeInfoSynchroniser;
    beforeEach(function() {
      monitor = new jashboard.model.Monitor({});
      monitor.loadingStatus = jashboard.model.loadingStatus.completed;
      callback = jasmine.createSpy("callback");
      runtimeInfoSynchroniser = monitor.runtimeInfoSynchroniser(callback);
    });

    it("should set the loadingStatus to 'waiting'", function() {
      expect(monitor.loadingStatus).toEqual(jashboard.model.loadingStatus.waiting);
    });
    it("should set the new runtime data and update the loading status to 'completed'", function() {
      runtimeInfoSynchroniser({testRuntimeInfo: "test"});

      expect(monitor.runtimeInfo).toEqual({testRuntimeInfo: "test"});
      expect(monitor.loadingStatus).toEqual(jashboard.model.loadingStatus.completed);
    });
    it("should invoke the callback", function() {
      runtimeInfoSynchroniser({testRuntimeInfo: "test"});

      expect(callback).toHaveBeenCalledWith(monitor);
    });
  });
});
