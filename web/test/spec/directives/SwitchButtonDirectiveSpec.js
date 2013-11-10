describe("SwitchButtonDirective", function() {
  var scope, directiveDefinitionObject, switchButtonWidget, switchButtonFunction, toggleFn;

  beforeEach(function() {
    switchButtonWidget = jasmine.createSpyObj("SwitchButton", ['setOn', 'setOff']);
    switchButtonFunction = spyOn(jashboard.widgets, "SwitchButton").andCallFake(function(el, callback) {
      toggleFn = callback;
      return switchButtonWidget;
    });
    scope = jasmine.createSpyObj("scope", ['$eval', '$on']);
    directiveDefinitionObject = jashboard.angular.switchButtonDirective();
  });

  it("should replace the current element with the new template", function() {
    expect(directiveDefinitionObject.replace).toBeTruthy();
    expect(directiveDefinitionObject.template).toEqual('<div><input type="checkbox"></div>');
  });

  describe("link function", function() {
    var watcherFn, watcherDeregistrationFn, $input;
    beforeEach(function() {
      $input = {
        attr: jasmine.createSpy("$.attr()")
      };
      var $element = {
        find: sinon.stub()
      };
      $element.find.withArgs("input").returns($input);
      angular.element = sinon.stub();
      angular.element.withArgs("test-element").returns($element);
    });

    describe("input initialisation", function() {
      beforeEach(function() {
        directiveDefinitionObject.link(scope, "test-element", {
          jbSwitchButtonId: "test_button_id",
          jbSwitchButtonToggle: "test_toggle_expr",
          ngModel: "test_model"
        });
      });

      it("should set the input 'id' and 'name' attributes according to the directive attribute", function() {
        expect($input.attr).toHaveBeenCalledWith("id", "test_button_id");
        expect($input.attr).toHaveBeenCalledWith("name", "test_button_id");
      });
      it("should create a switch button", function() {
        expect(switchButtonFunction).toHaveBeenCalledWith("test-element", jasmine.any(Function));
      });
    })

    describe("button activation", function() {
      beforeEach(function() {
        scope.$on.andCallFake(function(event, listener) {
          if (event === "OpenMonitorDialog") {
            listener({});
          }
        });
      });

      _.each(['test_expr', null], function(expr) {
        _.each([true, false], function(value) {
          it("should set the current switch button state according to the model value", function() {
            scope.$eval.andCallFake(function(expr) {
              if (expr === "test_model") return value;
              if (expr === "test_expr") return {activateOn: "OpenMonitorDialog"};
            });
            directiveDefinitionObject.link(scope, "test-element", {
              jbSwitchButton: expr,
              jbSwitchButtonId: "test_button_id",
              jbSwitchButtonToggle: "test_toggle_expr",
              ngModel: "test_model"
            });
            if (value) {
              expect(switchButtonWidget.setOn).toHaveBeenCalled();
            } else {
              expect(switchButtonWidget.setOff).toHaveBeenCalled();
            }
          });
        });
      });
    });

    describe("toggle functionality", function() {
      var mockEvent;
      beforeEach(function() {
        mockEvent = {
          target: "target_element"
        };
        $input.is = sinon.stub();
        angular.element.withArgs("target_element").returns($input);
        spyOn(jashboard.angularUtils, 'safeApply');

        directiveDefinitionObject.link(scope, "test-element", {
          jbSwitchButtonId: "test_button_id",
          jbSwitchButtonToggle: "test_toggle_expr",
          ngModel: "test_model"
        });
      });

      _.each([true, false], function(isChecked) {
        it("should set the model value depending on whether the element is checked or not", function() {
          $input.is.withArgs(":checked").returns(isChecked);
          toggleFn(mockEvent);

          expect(scope.$eval).toHaveBeenCalledWith("test_model=" + isChecked);
        });
        it("should apply the toggle attribute expression to the scope", function() {
          $input.is.withArgs(":checked").returns(isChecked);
          toggleFn(mockEvent);

          expect(jashboard.angularUtils.safeApply).toHaveBeenCalledWith(scope, "test_toggle_expr");
        });
      });
    });
  });
});
