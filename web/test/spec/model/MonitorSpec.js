describe("Monitor", function() {
  var monitor, monitorData;

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
    it("should create a monitor with empty configuration", function() {
      expect(monitor.configuration).toEqual({});
    });
    it("should create a monitor with empty runtime info", function() {
      expect(monitor.runtimeInfo).toEqual({});
    });
  });

  describe("Monitor layout", function() {
    beforeEach(function() {
      monitorData = {
        id: "test_id",
        name: "test_name",
        type: "test_type",
        refresh_interval: 123,
        configuration: {testConfiguration: "test"}
      };
    });

    it("should create a monitor with undefined size and position", function() {
      var monitor = new jashboard.model.Monitor(monitorData);

      expect(monitor.size).toBeUndefined();
      expect(monitor.position).toBeUndefined();
      expect(monitor.cssLayout()).toEqual({});
    });
    it("should create a monitor with an absolute initial position", function() {
      monitorData.position = {top: 20, left: 50};
      var monitor = new jashboard.model.Monitor(monitorData);

      expect(monitor.position).toEqual({top: 20, left: 50});
      expect(monitor.cssLayout()).toEqual({position: 'absolute', top: 20, left: 50});
    });

    it("should create a monitor with specific width and height", function() {
      monitorData.size = {width: 130, height: 250};
      var monitor = new jashboard.model.Monitor(monitorData);

      expect(monitor.size).toEqual({width: 130, height: 250});
      expect(monitor.cssLayout()).toEqual({width: 130, height: 250});
    });

    it("should set position and size", function() {
      var monitor = new jashboard.model.Monitor(monitorData);
      monitor.position = {top: 45, left: 20};
      monitor.size = {width: 130, height: 250};

      expect(monitor.cssLayout()).toEqual({position: 'absolute', top: 45, left: 20, width: 130, height: 250});
    });
  });
});
