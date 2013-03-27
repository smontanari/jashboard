describe("DashboardFormController", function() {
  var scope, controller, formValidator, repository, validatorConstructor, dashboardRulesConstructor, eventHandler;

  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ['$on', '$emit', '$apply']);
    scope.$on = jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
      eventHandler = handler;
    });
    dashboardRulesConstructor = sinon.stub(jashboard, "DashboardFormValidationRules");
    dashboardRulesConstructor.withArgs(scope).returns({id: "dashboardRules"});
    formValidator = jasmine.createSpyObj("FormValidator", ['initForm']);
    validatorConstructor = sinon.stub(jashboard, "FormValidator");
    validatorConstructor.withArgs({id: "dashboardRules"}).returns(formValidator);

    controller = new jashboard.DashboardFormController(scope, repository);
  });
  afterEach(function() {
    validatorConstructor.restore();
    dashboardRulesConstructor.restore();
  });

  describe("'OpenDashboardDialog' event listener", function() {
    beforeEach(function() {
      repository = {};
      scope.dashboardForm = "dashboardForm";
      scope.dashboardName = "test";
      eventHandler();
    });

    it("should set a FormValidator with the dashboard form validation rules in the scope", function() {
      expect(scope.dashboardFormValidator).toEqual(formValidator);
    });
    it("should init the form validator", function() {
      expect(formValidator.initForm).toHaveBeenCalledWith("dashboardForm");
    });
    it("should reset the dashboardName variable in the scope", function() {
      expect(scope.dashboardName).toEqual("");
    });
  });

  describe("saveDashboard()", function() {
    var successHandler, errorHandler;
    beforeEach(function() {
      scope.dashboards = [{id: "some dashbaord"}];
      scope.context = {};
      repository.createDashboard = jasmine.createSpy("repository.createDashboard()").andCallFake(function(input, handlers) {
        successHandler = handlers.success;
        errorHandler = handlers.error;
      });

      scope.dashboardName = "test.name";
      scope.saveDashboard();
    });

    it("should call the repository to create a dashboard", function() {
      expect(repository.createDashboard).toHaveBeenCalledWith({name: "test.name"}, jasmine.any(Object));
    });
    it("should add the dashboard to the scope", function() {
      successHandler({id: "test.dashboard"});

      expect(scope.dashboards.length).toEqual(2);
      expect(scope.dashboards).toContain({id: "test.dashboard"});
      expect(scope.$apply).toHaveBeenCalled();
    });
    it("should set the current active dashboard", function() {
      successHandler({id: "test_dashboard"});
      
      expect(scope.context.activeDashboardId).toEqual("test_dashboard");
    });
    it("should emit the 'DashboardCreateComplete' if successful", function() {
      successHandler("test.dashboard");
      expect(scope.$emit).toHaveBeenCalledWith("DashboardCreateComplete");
    });
    it("should emit the 'DashboardCreateStart' if successful", function() {
      expect(scope.$emit).toHaveBeenCalledWith("DashboardCreateStart");
    });
    it("should fire the 'AjaxError' event when failing to save the dashboard", function() {
      errorHandler();

      expect(scope.$emit).toHaveBeenCalledWith("AjaxError");
    });
  });
});
