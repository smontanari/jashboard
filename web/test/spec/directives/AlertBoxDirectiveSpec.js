describe("AlertBoxDirective", function() {
  var alertService, scope, directiveDefinition;

  beforeEach(function() {
    alertService = jasmine.createSpyObj("AlertService", ["bindTo"]);

    directiveDefinition = jashboard.angular.alertBoxDirective(alertService);

    directiveDefinition.link(scope, "test-element", {});
  });

  it("should bind the service the element", function() {
    expect(alertService.bindTo).toHaveBeenCalledWith("test-element");
  });
  it("should create a separate scope for the directive", function() {
    expect(directiveDefinition.scope).toEqual({});
  });
});
