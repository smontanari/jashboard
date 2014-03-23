describe("TooltipErrorDirective", function() {
  beforeEach(function() {
    this.directiveDefinition = jashboard.angular.tooltipErrorDirective();
  });

  describe('directive definition', function() {
    it('applies to an element', function() {
      expect(this.directiveDefinition.restrict).toEqual('E');
    });

    it('uses a template', function() {
      expect(this.directiveDefinition.templateUrl).toEqual('html/templates/tooltip_error.html');
    });

    it('defines elements in the scope', function() {
      expect(this.directiveDefinition.scope).toEqual({
        tooltipMessage: '=message',
        toggleStatus: '&toggle'
      });
    });
  });

  describe('link function', function() {
    var tooltipFn, tooltipWidget, scope, watchListener;
    beforeEach(function() {
      tooltipWidget = jasmine.createSpyObj("tooltip", ['show', 'hide']);
      tooltipFn = spyOn(jashboard.widgets, "Tooltip").andReturn(tooltipWidget);
      angular.element = jasmine.createSpy().andReturn({
        parent: function() {return 'parent_element';}
      });
      scope = {
        toggleStatus: 'test_toggle',
        $watch: jasmine.createSpy("scope.$watch()")
      };
      scope.$watch.andCallFake(function(expression, listener) {
        watchListener = listener;
      });
      this.directiveDefinition.link(scope, "test-element", {
        jbTooltip: "test_tooltip_expr",
        jbTooltipToggle: "test_watch_expr"
      });
    });

    it("should watch the given expression", function() {
      expect(scope.$watch).toHaveBeenCalledWith("test_toggle", jasmine.any(Function));
    });

    it("should create a tooltip widget", function() {
      expect(tooltipFn).toHaveBeenCalledWith('parent_element', 'test-element');
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
});
