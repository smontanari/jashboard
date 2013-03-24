describe("TooltipDirective", function() {
  var tooltipService, scope, watchListener;

  beforeEach(function() {
    tooltipService = jasmine.createSpyObj("TooltipService", ['attachHtmlTooltip', 'removeTooltip']);
    scope = {
      $eval: sinon.stub(),
      $watch: jasmine.createSpy("scope.$watch()")
    };
    scope.$eval.withArgs("test_expr").returns("test_target_selector");
    scope.$watch.andCallFake(function(expression, listener) {
      watchListener = listener;
    });

    var linkFunction = jashboard.angular.tooltipDirective(tooltipService);
    linkFunction(scope, "test-element", {jbTooltip: "test_expr", jbTooltipToggle: "test-watch"});
  });

  it("should watch the given expression", function() {
    expect(scope.$watch).toHaveBeenCalledWith("test-watch", jasmine.any(Function));
  });
  it("should invoke the tooltipService to attach the tooltip", function() {
    watchListener(true, false);

    expect(tooltipService.attachHtmlTooltip).toHaveBeenCalledWith("test_target_selector", "test-element");
  });
  it("The invoke the tooltipService to remove the tooltip", function() {
    watchListener(false, true);

    expect(tooltipService.removeTooltip).toHaveBeenCalledWith("test_target_selector");
  });
});
