describe("DialogDirective", function() {
  var linkFunction, dialogService, scope, attrs;

  beforeEach(function() {
    dialogService = jasmine.createSpyObj("DialogService", ["showModal", "hideModal"]);
    linkFunction = jashboard.dialogDirective(dialogService);
    scope = {
      $eval: jasmine.createSpy("scope.$eval()").andReturn({show: "testEventShow", hide: "testEventHide"}),
      $on: jasmine.createSpy("scope.$on()").andCallFake(function(eventName, callback) {
        callback({});
      })
    };
    attrs = {'jbDialog': "test-map"};

    linkFunction(scope, "test.element", attrs);
  });

  describe("Show action", function() {
    it("should register the event listener", function() {
      expect(scope.$on).toHaveBeenCalledWith("testEventShow", jasmine.any(Function));
    });
    it("should invoke the dialogService", function() {
      expect(dialogService.showModal).toHaveBeenCalledWith("test.element");
    });
  });

  describe("Hide action", function() {
    it("should register the event listener", function() {
      expect(scope.$on).toHaveBeenCalledWith("testEventHide", jasmine.any(Function));
    });
    it("should invoke the dialogService", function() {
      expect(dialogService.hideModal).toHaveBeenCalledWith("test.element");
    });
  });
});
