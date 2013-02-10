describe("OverlayService", function() {
  var service;
  var $stub;

  beforeEach(function() {
    $stub = testHelper.stubJQuery(["test-message"]);
    service = new jashboard.OverlayService();
  });

  it("should call the blockUI plugin with the specified element content", function() {
    $stub.blockUI = jasmine.createSpy("$.blockUI()");
    $stub.html = jasmine.createSpy("$.html()").andReturn(" the message ");

    service.show("test-message");

    expect($stub.blockUI).toHaveBeenCalledWith(jasmine.objectContaining({message: "the message"}));
  });
  it("should call the blockUI plugin with the specified message", function() {
    $stub.unblockUI = jasmine.createSpy("$.unblockUI()");

    service.hide();

    expect($stub.unblockUI).toHaveBeenCalled();
  });
});