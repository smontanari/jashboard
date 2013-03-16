describe("TooltipDirective", function() {
  var tooltipService, actions, scope;

  beforeEach(function() {
    tooltipService = jasmine.createSpyObj("TooltipService", ['attachHtmlTooltip', 'removeTooltip']);
    scope = {
      $eval: sinon.stub()
    };
    scope.$eval.withArgs("test_for_expr").returns("test_target_selector");

    spyOn(jashboard.angular, "EventDirectiveDefinition")
      .andCallFake(function(attributeName, factory) {
        actions = factory(scope, "test-element", {"jbTooltip": "test_expr", "jbTooltipFor": "test_for_expr"});
      });


    jashboard.angular.tooltipDirective(tooltipService);
  });

  it("should pass the correct attribute name", function() {
    expect(jashboard.angular.EventDirectiveDefinition).toHaveBeenCalledWith("jbTooltip", jasmine.any(Function));
  });
  it("The 'show' action should invoke the tooltipService", function() {
    actions.show();
    expect(tooltipService.attachHtmlTooltip).toHaveBeenCalledWith("test_target_selector", "test-element");
  });
  it("The 'hide' action should invoke the tooltipService", function() {
    actions.hide();
    expect(tooltipService.removeTooltip).toHaveBeenCalledWith("test_target_selector");
  });
});
