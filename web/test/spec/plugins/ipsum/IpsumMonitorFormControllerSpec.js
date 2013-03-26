describe("IpsumMonitorFormController", function() {
  var controller, scope, eventListener;

  beforeEach(function() {
    scope = {
      $on: jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
        eventListener = handler;
      })
    };
    controller = new jashboard.plugin.ipsum.IpsumMonitorFormController(scope);
  });

  it("should put in the scope the different languages", function() {
    expect(scope.availableLanguages).toEqual(["english", "french", "latin"]);
  });
  describe("'OpenMonitorDialog' event listener", function() {
    beforeEach(function() {
      scope.inputMonitor = {
        configuration: {
          ipsum: {
            language: "test-language", 
            no_sentences: 123
          }
        }
      };
    });
    it("should listen to the 'OpenMonitorDialog' event", function() {
      expect(scope.$on).toHaveBeenCalledWith("OpenMonitorDialog", jasmine.any(Function));
    });
    it("should reset the inputMonitor.configuration variable in the scope", function() {
      eventListener({});

      expect(scope.inputMonitor.configuration.ipsum).toEqual({language: "english"});
    });
  });
});