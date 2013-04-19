describe("SwitchButtonDirective", function() {
  var scope, directiveDefinitionObject, widgetService;

  beforeEach(function() {
    widgetService = jasmine.createSpyObj("WidgetService", ["makeSwitchButton"]);
    scope = jasmine.createSpyObj("scope", ['$watch', '$eval', '$on']);
    directiveDefinitionObject = jashboard.angular.switchButtonDirective(widgetService);
  });

  it("should replace the current element with the new template", function() {
    expect(directiveDefinitionObject.replace).toBeTruthy();
    expect(directiveDefinitionObject.template).toEqual('<div><input type="checkbox"></div>');
  });

  describe("link function", function() {
    var watcherFn, watcherDeregistrationFn, $input;
    beforeEach(function() {
      watcherDeregistrationFn = jasmine.createSpy();
      scope.$watch.andCallFake(function(expr, callback) {
        watcherFn = callback;
        return watcherDeregistrationFn;
      });

      $input = {
        attr: jasmine.createSpy("$.attr()")
      };
      var $element = {
        find: sinon.stub()
      };
      $element.find.withArgs("input").returns($input);
      angular.element = sinon.stub();
      angular.element.withArgs("test-element").returns($element);

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
    describe("ngModel watcher function", function() {
      it("should watch the expression set in the ngModel attribute", function() {
        expect(scope.$watch).toHaveBeenCalledWith("test_model", jasmine.any(Function));
      });
      _.each([true, false], function(value) {
        it("should invoke the widgetService to make a switch button and then deregister the watcher when the model is defined", function() {
          watcherFn(value, undefined);

          expect(widgetService.makeSwitchButton).toHaveBeenCalledWith("test-element", value, jasmine.any(Function));
          expect(watcherDeregistrationFn).toHaveBeenCalled();
        });
      });
      it("should not invoke the widgetService nor the deregistration function when the model is not defined", function() {
        watcherFn(undefined, undefined);

        expect(widgetService.makeSwitchButton).not.toHaveBeenCalled();
        expect(watcherDeregistrationFn).not.toHaveBeenCalled();
      });

      describe("toggle functionality", function() {
        var mockEvent, toggleFn;
        beforeEach(function() {
          mockEvent = {
            target: "target_element"
          };
          widgetService.makeSwitchButton.andCallFake(function(el, value, callback) {
            toggleFn = callback;
          });
          $input.is = sinon.stub();
          angular.element.withArgs("target_element").returns($input);
          jashboard.angularUtils.safeApply = jasmine.createSpy("jashboard.angularUtils.safeApply()");

          watcherFn(true, undefined);
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
});
