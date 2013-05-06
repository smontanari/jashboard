describe("DialogService", function() {
  var service;
  var $stub;

  beforeEach(function() {
    $stub = testHelper.stubJQuery("test-selector");
    $stub.modal = jasmine.createSpy("$.modal()");
    $stub.on = jasmine.createSpy("$.on()");
    service = new jashboard.DialogService();
  });

  describe("showModal()", function() {
    it("should invoke $.modal('show')", function() {
      service.showModal("test-selector");

      expect($stub.modal).toHaveBeenCalledWith("show");
    });
    it("should invoke the callback when the modal is shown", function() {
      var callback = jasmine.createSpy();
      
      service.showModal("test-selector", callback);

      expect($stub.on).toHaveBeenCalledWith("shown", callback);
    });
  });

  describe("hideModal()", function() {
    it("should invoke $.modal('hide')", function() {
      service.hideModal("test-selector");

      expect($stub.modal).toHaveBeenCalledWith("hide");
    });
  });
});
