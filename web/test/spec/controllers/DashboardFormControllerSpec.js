describe("DashboardFormController", function() {
  var scope, controller, repository, eventListener;

  beforeEach(function() {
    scope = jasmine.createSpyObj("scope", ['$on', '$emit', '$apply']);
    scope.$on = jasmine.createSpy("scope.$on").andCallFake(function(eventName, handler) {
      if (eventName === "OpenDashboardDialog") eventListener = handler;
    });
    repository = {};

    controller = new jashboard.DashboardFormController(scope, repository);
  });

  describe("'OpenDashboardDialog' event in create mode", function() {
    beforeEach(function() {
      scope.dashboardFormModel = {id: "test", name: "test_name"};

      eventListener({}, {mode: jashboard.inputOptions.createMode});
    });

    it("should reset the dashboardFormModel variable in the scope", function() {
      expect(scope.dashboardFormModel).toEqual({});
    });
    it("should set the $editMode variable in the scope", function() {
      expect(scope.$editMode).toEqual(jashboard.inputOptions.createMode);
    });

    describe("saveDashboard()", function() {
      var successHandler, errorHandler;
      describe("creating a new dashboard", function() {
        beforeEach(function() {
          scope.dashboards = [{id: "some dashboard"}];
          scope.context = {};
          repository.createDashboard = jasmine.createSpy("repository.createDashboard()").andCallFake(function(input, handlers) {
            successHandler = handlers.success;
            errorHandler = handlers.error;
          });

          scope.dashboardFormModel = {name: "test.name"};
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
    });
  });

  describe("'OpenDashboardDialog' event in update mode", function() {
    beforeEach(function() {
      scope.dashboardFormModel = {};

      eventListener({}, {
        mode: jashboard.inputOptions.updateMode,
        parameters: {dashboard: {id: "test_dashboard_id", name: "test_dashboard_name", monitors: []}
      }});
    });

    it("should update the dashboardFormModel variable in the scope", function() {
      expect(scope.dashboardFormModel).toEqual({id: "test_dashboard_id", name: "test_dashboard_name"});
    });
    it("should set the $editMode variable in the scope", function() {
      expect(scope.$editMode).toEqual(jashboard.inputOptions.updateMode);
    });

    describe("saveDashboard()", function() {
      var successHandler, errorHandler;
      describe("updating a dashboard", function() {
        beforeEach(function() {
          scope.dashboards = [{id: "some dashboard", name: "some name"}, {id: "test.id", name: "test.name"}];
          repository.updateDashboard = jasmine.createSpy("repository.updateDashboard()").andCallFake(function(input, handlers) {
            successHandler = handlers.success;
            errorHandler = handlers.error;
          });

          scope.dashboardFormModel = {id:"test.id", name: "test.another_name"};
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
          successHandler({id: "test_dashboard"});
          
          expect(scope.$emit).toHaveBeenCalledWith("DashboardSaveComplete");
        });
        it("should fire the 'AjaxError' event when failing to save the dashboard", function() {
          errorHandler();

          expect(scope.$emit).toHaveBeenCalledWith("AjaxError");
        });
      });
    });
  });
});
