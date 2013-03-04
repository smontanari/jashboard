describe("DialogService", function() {
  var service;
  var $stub;

  beforeEach(function() {
    $stub = testHelper.stubJQuery("test-selector");
    $stub.modal = jasmine.createSpy("$.modal()");
    service = new jashboard.DialogService();
  });

  it("should invoke $.modal('show')", function() {
    service.showModal("test-selector");

    expect($stub.modal).toHaveBeenCalledWith("show");
  });
  it("should invoke $.modal('hide')", function() {
    service.hideModal("test-selector");

    expect($stub.modal).toHaveBeenCalledWith("hide");
  });
});
