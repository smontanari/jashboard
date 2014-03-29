describe("SwitchButtonDirective", function() {
  var scope, directiveDefinitionObject, switchButtonWidget, switchButtonFunction, toggleFn;

  beforeEach(function() {
    switchButtonWidget = jasmine.createSpyObj("SwitchButton", ['reset']);
    switchButtonFunction = spyOn(jashboard.widgets, "SwitchButton").andCallFake(function(el, state, callback) {
      toggleFn = callback;
      return switchButtonWidget;
    });
    scope = jasmine.createSpyObj("scope", ['$on', 'state', 'toggle']);
    directiveDefinitionObject = jashboard.angular.switchButtonDirective();
  });

  it('restricts the usage to just elements', function() {
    expect(directiveDefinitionObject.restrict).toEqual('E');
  });
  
  it('defines an isolated scope', function() {
    expect(directiveDefinitionObject.scope).toEqual({
      attrId: '@id',
      attrOn: '@on',
      attrClass:'@class',
      state: '&value',
      toggle: '&'
    });
  });
  
  it("replaces the current element with the new template", function() {
    expect(directiveDefinitionObject.replace).toBeTruthy();
    expect(directiveDefinitionObject.template).toEqual('<input id="{{attrId}}" name="{{attrId}}" class="{{attrClass}}" data-on="{{attrOn}}" type="checkbox">');
  });

  describe("link function", function() {
    var listener;
    beforeEach(function() {
      scope.state.andReturn('test_state');
      scope.$on.andCallFake(function(event, fn) {
        if (event === "activate_event") {
          listener = fn;
          listener({});
        }
      });
      directiveDefinitionObject.link(scope, "test-element", {activateOn: 'activate_event'});
    });

    it("creates a switch button", function() {
      expect(switchButtonFunction).toHaveBeenCalledWith("test-element", 'test_state', jasmine.any(Function));
      expect(switchButtonWidget.reset).not.toHaveBeenCalled();
    });

    it("resets the switch button if it already exists", function() {
      scope.state.andReturn('another_state');
      listener({});

      expect(switchButtonWidget.reset).toHaveBeenCalledWith('another_state');
    });

    it("stes set the current switch button state according to the state scope attribute", function() {
      expect(switchButtonFunction).toHaveBeenCalledWith("test-element", 'test_state', jasmine.any(Function));
    });

    it("uses the toggle callback defined in the scope", function() {
      expect(switchButtonFunction).toHaveBeenCalledWith("test-element", 'test_state', scope.toggle);
    });
  });
});
