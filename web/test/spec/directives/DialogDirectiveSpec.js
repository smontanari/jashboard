describe("DialogDirective", function() {
  var dialogService, actions, scope, linkFunction, onVisibleCallback;

  beforeEach(function() {
    scope = {
      $broadcast: jasmine.createSpy("scope.$broadcast()"),
      $eval: sinon.stub()
    };
    scope.$eval.withArgs("test-map").returns("test-events");
    dialogService = jasmine.createSpyObj("DialogService", ["showModal", "hideModal"]);
    dialogService.showModal.andCallFake(function(element, callback) {
      onVisibleCallback = callback;
    });
    spyOn(jashboard.angularUtils, 'mapEventActions').andCallFake(function(scope, eventsMap, actionsMap) {
      actions = actionsMap;
    });

    linkFunction = jashboard.angular.dialogDirective(dialogService);

    linkFunction(scope, "test-element", {jbDialog: "test-map", jbDialogNotifyWhenVisible: ""});
  });

  it("should map the events to the actions", function() {
    expect(jashboard.angularUtils.mapEventActions).toHaveBeenCalledWith(scope, "test-events", jasmine.any(Object));
  });
  it("The 'show' action should invoke the dialogService", function() {
    actions.show();
    expect(dialogService.showModal).toHaveBeenCalledWith("test-element", jasmine.any(Function));
  });
  it("The 'hide' action should invoke the dialogService", function() {
    actions.hide();
    expect(dialogService.hideModal).toHaveBeenCalledWith("test-element");
  });
  it("should broadcast the 'DialogVisible' event", function() {
    actions.show();
    if (onVisibleCallback) onVisibleCallback();

    expect(scope.$broadcast).toHaveBeenCalledWith("DialogVisible");
  });
});
