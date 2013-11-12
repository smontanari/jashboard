describe("TooltipDirective", function() {
  var tooltipFn, tooltipWidget, scope, watchListener;

  beforeEach(function() {
    tooltipWidget = jasmine.createSpyObj("tooltip", ['show', 'hide']);
    tooltipFn = spyOn(jashboard.widgets, "Tooltip").andReturn(tooltipWidget);
    scope = {
      $eval: sinon.stub(),
      $evalAsync: jasmine.createSpy("scope.$evalAsync()"),
      $watch: jasmine.createSpy("scope.$watch()")
    };
    scope.$eval.withArgs("test_tooltip_expr").returns("test_target_selector");
    scope.$evalAsync.andCallFake(function(callback) {
      callback();
    });
    scope.$watch.andCallFake(function(expression, listener) {
      watchListener = listener;
    });

    var linkFunction = jashboard.angular.tooltipDirective();
    linkFunction(scope, "test-element", {
      jbTooltip: "test_tooltip_expr",
      jbTooltipToggle: "test_watch_expr"
    });
  });

  it("should watch the given expression", function() {
    expect(scope.$watch).toHaveBeenCalledWith("test_watch_expr", jasmine.any(Function));
  });

  it("should create a tooltip widget", function() {
    expect(tooltipFn).toHaveBeenCalledWith('test_target_selector', 'test-element');
  });
  it("should show the tooltip", function() {
    watchListener(true);

    expect(tooltipWidget.show).toHaveBeenCalled();
  });
  it("should hide the tooltip", function() {
    watchListener(false);

    expect(tooltipWidget.hide).toHaveBeenCalled();
  });
  _.each([true, false], function(toggle) {
    it("should not act on the tooltip if no change", function() {
      watchListener(toggle, toggle);

      expect(tooltipWidget.show).not.toHaveBeenCalled();
      expect(tooltipWidget.hide).not.toHaveBeenCalled();
    });
  });
});
