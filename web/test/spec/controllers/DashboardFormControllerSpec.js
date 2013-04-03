describe("DashboardFormController", function() {
  var scope, controller, formValidator, repository, dashboardRulesConstructor, eventHandler;

  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ['$on', '$emit', '$apply']);
    scope.$on = jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
      eventHandler = handler;
    });
    repository = {};
    dashboardRulesConstructor = sinon.stub(jashboard, "DashboardFormValidationRules");
    dashboardRulesConstructor.withArgs(scope).returns({id: "dashboardRules"});
    formValidator = jasmine.createSpyObj("FormValidator", ['prepareFormForCreate', 'prepareFormForUpdate']);
    spyOn(jashboard, "FormValidator").andReturn(formValidator);

    controller = new jashboard.DashboardFormController(scope, repository);
  });
  afterEach(function() {
    dashboardRulesConstructor.restore();
  });

  describe("'OpenDashboardDialog' event listener", function() {
    beforeEach(function() {
      scope.dashboardForm = "dashboardForm";
      scope.inputDashboard = {id: "test", name: "test_name"};
    });
    it("should set a FormValidator with the dashboard form validation rules in the scope", function() {
      expect(scope.dashboardFormValidator).toEqual(formValidator);
    });
    describe("create mode", function() {
      beforeEach(function() {
        eventHandler({}, {mode: jashboard.inputOptions.createMode});
      });
      it("should init the form validator", function() {
        expect(formValidator.prepareFormForCreate).toHaveBeenCalledWith("dashboardForm", {id: "dashboardRules"});
      });
      it("should reset the inputDashboard variable in the scope", function() {
        expect(scope.inputDashboard).toEqual({});
      });
      it("should set the editMode variable in the scope", function() {
        expect(scope.editMode).toEqual(jashboard.inputOptions.createMode);
      });
    });
    describe("update mode", function() {
      beforeEach(function() {
        eventHandler({}, {
          mode: jashboard.inputOptions.updateMode,
          parameters: {
            dashboard: {id: "test_dashboard_id", name: "test_dashboard_name", monitors: []}
          }
        });
      });
      it("should init the form validator", function() {
        expect(formValidator.prepareFormForUpdate).toHaveBeenCalledWith("dashboardForm", {id: "dashboardRules"});
      });
      it("should update the inputDashboard variable in the scope", function() {
        expect(scope.inputDashboard).toEqual({id: "test_dashboard_id", name: "test_dashboard_name"});
      });
      it("should set the editMode variable in the scope", function() {
        expect(scope.editMode).toEqual(jashboard.inputOptions.updateMode);
      });
    });
  });

  describe("saveDashboard()", function() {
    var successHandler, errorHandler;
    describe("creating a new dashboard", function() {
      beforeEach(function() {
        scope.dashboards = [{id: "some dashboard"}];
        scope.context = {};
        scope.editMode = jashboard.inputOptions.createMode;
        repository.createDashboard = jasmine.createSpy("repository.createDashboard()").andCallFake(function(input, handlers) {
          successHandler = handlers.success;
          errorHandler = handlers.error;
        });

        scope.inputDashboard = {name: "test.name"};
        scope.saveDashboard();
      });

      it("should emit the 'DashboardSaveStart'", function() {
        expect(scope.$emit).toHaveBeenCalledWith("DashboardSaveStart");
      });
      it("should emit the 'CloseDashboardDialog'", function() {
        expect(scope.$emit).toHaveBeenCalledWith("CloseDashboardDialog");
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
      it("should emit the 'DashboardSaveComplete' if successful", function() {
        successHandler({id: "test_dashboard"});
        
        expect(scope.$emit).toHaveBeenCalledWith("DashboardSaveComplete");
      });
      it("should fire the 'AjaxError' event when failing to save the dashboard", function() {
        errorHandler();

        expect(scope.$emit).toHaveBeenCalledWith("AjaxError");
      });
    });
    
    describe("Updating an existing dashboard", function() {
      beforeEach(function() {
        scope.editMode = jashboard.inputOptions.updateMode;
        scope.dashboards = [{id: "some dashboard", name: "some name"}, {id: "test.id", name: "test.name"}];
        repository.updateDashboard = jasmine.createSpy("repository.updateDashboard()").andCallFake(function(input, handlers) {
          successHandler = handlers.success;
          errorHandler = handlers.error;
        });

        scope.inputDashboard = {id:"test.id", name: "test.another_name"};
        scope.saveDashboard();
      });
      it("should emit the 'DashboardSaveStart'", function() {
        expect(scope.$emit).toHaveBeenCalledWith("DashboardSaveStart");
      });
      it("should emit the 'CloseDashboardDialog'", function() {
        expect(scope.$emit).toHaveBeenCalledWith("CloseDashboardDialog");
      });
      it("should call the repository to update a dashboard", function() {
        expect(repository.updateDashboard).toHaveBeenCalledWith({id:"test.id", name: "test.another_name"}, jasmine.any(Object));
      });
      it("should update the dashboard name if successful", function() {
        successHandler();

        expect(scope.dashboards[1]).toEqual({id:"test.id", name: "test.another_name"});
        expect(scope.$apply).toHaveBeenCalled();
      });
      it("should emit the 'DashboardSaveComplete' if successful", function() {
        successHandler();

        expect(scope.$emit).toHaveBeenCalledWith("DashboardSaveComplete");
      });
      it("should fire the 'AjaxError' event when failing to save the dashboard", function() {
        errorHandler();

        expect(scope.$emit).toHaveBeenCalledWith("AjaxError");
      });
    });
  });
});
