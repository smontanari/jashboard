describe("AlertService", function() {
  var service, $stub ,scope;

  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ['$apply']);
    var mockElement = {
      scope: jasmine.createSpy("element.scope()").andReturn(scope)
    };
    angular.element = jasmine.createSpy("angular.element()").andReturn(mockElement);
    $stub = testHelper.stubJQuery(["test_selector", ".modal-backdrop"]);
    $stub.modal = jasmine.createSpy("$.modal()");
    $stub.css = jasmine.createSpy("$.css()");
    service = new jashboard.AlertService();
    service.bindTo("test_selector");
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

    expect(angular.element).toHaveBeenCalledWith("test_selector");

    expect(scope.alertOptions.title).toEqual("test-title");
    expect(scope.alertOptions.message).toEqual("test-message");
    expect(scope.alertOptions.confirmLabel).toEqual("test-confirm");
    expect(scope.alertOptions.cancelLabel).toEqual("test-cancel");
    expect(scope.alertOptions.confirmAction).toEqual(action);
  });
});
