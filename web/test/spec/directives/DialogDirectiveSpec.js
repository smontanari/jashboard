describe("DialogDirective", function() {
  var dialogService, actions;

  beforeEach(function() {
    dialogService = jasmine.createSpyObj("DialogService", ["showModal", "hideModal"]);
    spyOn(jashboard.angular, "EventDirectiveDefinition")
      .andCallFake(function(attributeName, factory) {
        actions = factory("test-element");
      });

    jashboard.angular.dialogDirective(dialogService);
  });

  it("should pass the correct attribute name", function() {
    expect(jashboard.angular.EventDirectiveDefinition).toHaveBeenCalledWith("jbDialog", jasmine.any(Function));
  });
  it("The 'show' action should invoke the dialogService", function() {
    actions.show();
    expect(dialogService.showModal).toHaveBeenCalledWith("test-element");
  });
  it("The 'hide' action should invoke the dialogService", function() {
    actions.hide();
    expect(dialogService.hideModal).toHaveBeenCalledWith("test-element");
  });
});
