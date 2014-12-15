describe("AlertService", function() {
  var service, elementBinding;

  beforeEach(function() {
    elementBinding = jasmine.createSpyObj("elementBinding", ['bindDefaultElement', 'applyToElement']);
    spyOn(jashboard, "ElementBinding").and.returnValue(elementBinding);

    service = new jashboard.AlertService();
  });

  it("shoul bind the element as default", function() {
    service.bindTo("test_selector");

    expect(elementBinding.bindDefaultElement).toHaveBeenCalledWith("test_selector");
  });

  describe("showAlert()", function() {
    var $stub, scope;
    beforeEach(function() {
      scope = {};
      elementBinding.applyToElement = jasmine.createSpy().and.callFake(function(callback) {
        callback("test_element", scope);
      });
      $stub = testHelper.stubJQuery(["test_element", ".modal-backdrop"]);
      $stub.modal = jasmine.createSpy("$.modal()");
      $stub.css = jasmine.createSpy("$.css()");
    });

    it("should invoke $.modal() with the bound element", function() {
      service.showAlert({});

      expect($stub.modal).toHaveBeenCalledWith('show');
    });
    it("should adjust the opacity of the overlay", function() {
      service.showAlert({});

      expect($stub.css).toHaveBeenCalledWith("opacity", "0.2");
    });
    it("should set the given alertOptions in the target scope", function() {
      var action = function() {};
      service.showAlert({
        title: "test-title",
        message: "test-message",
        confirmLabel: "test-confirm",
        cancelLabel: "test-cancel",
        confirmAction: action
      });

      expect(scope.alertOptions.title).toEqual("test-title");
      expect(scope.alertOptions.message).toEqual("test-message");
      expect(scope.alertOptions.confirmLabel).toEqual("test-confirm");
      expect(scope.alertOptions.cancelLabel).toEqual("test-cancel");
      expect(scope.alertOptions.confirmAction).toEqual(action);
    });
  });
});
