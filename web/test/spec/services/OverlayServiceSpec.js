describe("OverlayService", function() {
  var service, $stub, settings;

  beforeEach(function() {
    $stub = testHelper.stubJQuery("test-message");
    $stub.blockUI = jasmine.createSpy("$.blockUI()").and.callFake(function(config) {
      settings = config;
    });
    $stub.unblockUI = jasmine.createSpy("$.unblockUI()");

    service = new jashboard.OverlayService();
  });

  it("should invoke the blockUI plugin overriding the default opacity", function() {
    service.show("test-message", { opacity: '0.1' });

    expect(settings.overlayCSS.opacity).toEqual('0.1');
  });
  it("should set a timeout according to the autoHideAfter option", function() {
    service.show("test-message", { autoHideAfter: 123 });

    expect(settings.timeout).toEqual(123);
  });
  it("should not set a timeout if the autoHideAfter option is undefined", function() {
    service.show("test-message", { });

    expect(settings.timeout).toBeUndefined();
  });
  it("should call the blockUI plugin with the specified element content", function() {
    service.show("test-message");

    expect(settings.message).toEqual($stub);
  });
  it("should call the blockUI plugin with the specified message", function() {
    service.hide();

    expect($stub.unblockUI).toHaveBeenCalled();
  });
});