describe("TooltipDirective", function() {
  var tooltipService, linkFunction, scope;

  beforeEach(function() {
    tooltipService = jasmine.createSpyObj("TooltipService", ["attachTextTooltip", "removeTooltip"]);
    scope = jasmine.createSpyObj("scope", ['$watch']);

    linkFunction = jashboard.angular.tooltipDirective(tooltipService);

    linkFunction(scope, "test-element", {"jbTooltip": "test_expr"})
  });

  xit("should add a tooltip when a value exists", function() {
    scope.$watch = jasmine.createSpy("scope.$watch()").andCallFake(function(expr, listener) {
      listener("test_new_value");
    });

    expect(scope.$watch).toHaveBeenCalledWith("test_expr");

    expect(tooltipService.attachTextTooltip).toHaveBeenCalledWith("test-element", "test_new_value");
  });
  xit("should remove the tooltip when the value is not defined", function() {
    scope.$watch = jasmine.createSpy("scope.$watch()").andCallFake(function(expr, listener) {
      listener(undefined, "test_old_value");
    });

    expect(scope.$watch).toHaveBeenCalledWith("test_expr");

    expect(tooltipService.removeTooltip).toHaveBeenCalledWith("test-element");
  });
});
