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
  
  describe("Updating runtime info", function() {
    beforeEach(function() {
      monitor = new jashboard.model.Monitor({});
      monitor.updateRuntimeInfo({testRuntimeInfo: "test"});
    });

    it("should set the new runtime data", function() {
      expect(monitor.runtimeInfo).toEqual({testRuntimeInfo: "test"});
    });
    it("should update the loading status to 'completed'", function() {
      expect(monitor.loadingStatus).toEqual(jashboard.model.loadingStatus.completed);
    });
  });
});
