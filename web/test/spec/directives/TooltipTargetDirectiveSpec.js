describe("TooltipTargetDirective", function() {
  var tooltipService, linkFunction, scope;

  beforeEach(function() {
    tooltipService = jasmine.createSpyObj("TooltipService", ["bindAs"]);
    scope = {
      $eval: sinon.stub().withArgs("test_expr").returns("test_key")
    };

    linkFunction = jashboard.angular.tooltipTargetDirective(tooltipService);

    linkFunction(scope, "test-element", {"jbTooltipTarget": "test_expr"});
  });

  it("should bind the element to the service", function() {
    expect(tooltipService.bindAs).toHaveBeenCalledWith("test-element", "test_key");
  });
});
