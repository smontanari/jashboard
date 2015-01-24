describe("MonitorScheduler", function() {
  var intervalService, scheduleFunction, monitor;

  beforeEach(function() {
    intervalService = jasmine.createSpy('intervalServiceFn').and.callFake(function(fn) {
      scheduleFunction = fn;
      return {id: "scheduler"};
    });
    intervalService.cancel = jasmine.createSpy('$interval.cancel()');
    monitor = {};

    this.service = new jashboard.MonitorScheduler(intervalService);
  });

  describe('.cancelUpdateSchedule()', function() {
    it("does not cancel a non existing schedule", function() {
      this.service.cancelUpdateSchedule(monitor);

      expect(intervalService.cancel).not.toHaveBeenCalled();
    });

    it("cancels the current schedule if it exists", function() {
      monitor.runtimeUpdateScheduler = {id: "scheduler"};

      this.service.cancelUpdateSchedule(monitor);

      expect(intervalService.cancel).toHaveBeenCalledWith({id: "scheduler"});
    });
  });

  describe('.scheduleUpdate()', function() {
    var callbackFn;

    describe('valid refreshInterval value', function() {
      beforeEach(function() {
        monitor.refreshInterval = 10;
        callbackFn = jasmine.createSpy('callback');

        this.service.scheduleUpdate(monitor, callbackFn);
      });

      it("schedules a new update after the given interval", function() {
        expect(intervalService).toHaveBeenCalledWith(callbackFn, 10000);
      });

      it("saves the new scheduler into the monitor", function() {
        expect(monitor.runtimeUpdateScheduler).toEqual({id: "scheduler"});
      });
    });

    _.each([0, NaN, null], function(value) {
      it("does not schedule a new update if the refresh interval is " + value, function() {
        monitor.refreshInterval = value;

        this.service.scheduleUpdate(monitor);

        expect(intervalService).not.toHaveBeenCalled();
      });
    });
  });
});