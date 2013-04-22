describe("VcsMonitorFormController", function() {
  var controller, scope, eventListener;

  beforeEach(function() {
    scope = {
      $on: jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
        eventListener = handler;
      })
    };

    controller = new jashboard.plugin.vcs.VcsMonitorFormController(scope);
  });

  it("should set the available vcs types in the scope", function() {
    expect(scope.availableVcsTypes).toEqual(["git"]);
  });
  it("should listen to the 'OpenMonitorDialog' event", function() {
    expect(scope.$on).toHaveBeenCalledWith("OpenMonitorDialog", jasmine.any(Function));
  });

  describe("scope.toggleSlideShowEffect()", function() {
    it("should nullify the commitsPerPage value if the slideShowEffect is disabled", function() {
      scope.monitorConfigurationFormModel = { vcs: {
        slideShowEffect: false,
        commitsPerPage: 123
      }};
      scope.toggleSlideShowEffect();

      expect(scope.monitorConfigurationFormModel.vcs.commitsPerPage).toBeNull();
    });
    it("should not reset the commitsPerPage value if the slideShowEffect is enabled", function() {
      scope.monitorConfigurationFormModel = { vcs: {
        slideShowEffect: true,
        commitsPerPage: 123
      }};
      scope.toggleSlideShowEffect();

      expect(scope.monitorConfigurationFormModel.vcs.commitsPerPage).toEqual(123);
    });
  });

  describe("'OpenMonitorDialog' event listener", function() {
    beforeEach(function() {
      scope.monitorConfigurationFormModel = {};
      scope.formHelper = jasmine.createSpyObj("formHelper", ['registerMonitorTypeForm']);
      scope.vcsMonitorForm = "test_monitor_form";
    });

    it("should register the vcsMonitorForm to the formHelper", function() {
      eventListener({}, {});

      expect(scope.formHelper.registerMonitorTypeForm).toHaveBeenCalledWith("vcs", "test_monitor_form");
    });
    it("should reset the form model in the scope", function() {
      eventListener({}, {
        mode: jashboard.inputOptions.createMode,
      });

      expect(scope.monitorConfigurationFormModel.vcs).toEqual({
        type: "git",
        historyLength: 1,
        slideShowEffect: false
      });
    });
  });
});